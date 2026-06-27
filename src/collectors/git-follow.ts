/**
 * Git follow collector — tracks file renames via `git log --follow --diff-filter=R`
 */

import type { CommitInfo, FollowOptions, RenameEvent, RenameHistory } from '../types'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { GitCommandError } from '../errors'
import { cacheKey } from './git-cache'

const exec = promisify(execFile)

/** Track the rename history of a file */
export async function collectFollow(options: FollowOptions): Promise<RenameHistory> {
	const { root, file, cache } = options

	// Check cache
	const key = cacheKey('follow', root, file)
	if (cache) {
		const cached = cache.get<RenameHistory>(key)
		if (cached) return cached
	}

	const start = performance.now()

	const renames: RenameEvent[] = []
	let originalPath = file

	try {
		// Single command: combined format + name-status
		// Use %x00 between format fields, then --name-status for rename paths
		const { stdout } = await exec(
			'git',
			[
				'log',
				'--follow',
				'--diff-filter=R',
				`--format=COMMIT:%H%x00%h%x00%an%x00%ae%x00%aI%x00%cn%x00%ce%x00%cI%x00%s%x00%P`,
				'--name-status',
				'--',
				file,
			],
			{ cwd: root, maxBuffer: 50 * 1024 * 1024 }
		)

		const commits = parseCombinedOutput(stdout)

		for (const { commit, from, to, similarity } of commits) {
			renames.push({ commit, from, to, similarity })
		}

		// The original path is the "from" of the earliest rename
		if (renames.length > 0) {
			originalPath = renames[renames.length - 1]!.from
		}
	} catch (err) {
		// File might have no renames — only throw for real errors (not "no renames found")
		const isRealError = err instanceof Error && !/no such path/i.test(err.message)
		if (isRealError) {
			throw new GitCommandError({
				command: 'log',
				args: ['--follow', '--diff-filter=R', '--', file],
				cwd: root,
				message: `Failed to track renames for ${file}`,
				cause: err,
			})
		}
	}

	const result = {
		currentPath: file,
		originalPath,
		renames,
		duration: Math.round(performance.now() - start),
	}
	if (cache) cache.set(key, result)
	return result
}

/** Parse combined format+name-status output in a single pass */
function parseCombinedOutput(
	output: string
): Array<{ commit: CommitInfo; from: string; to: string; similarity: number }> {
	const results: Array<{ commit: CommitInfo; from: string; to: string; similarity: number }> = []
	let currentCommit: CommitInfo | null = null

	for (const line of output.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed) continue

		// COMMIT line: COMMIT:<hash>\0<abbrev>\0<author>\0<email>\0<date>\0<committer>\0<email>\0<date>\0<msg>\0<parents>
		if (trimmed.startsWith('COMMIT:')) {
			const payload = trimmed.slice(7)
			const parts = payload.split('\x00')
			if (parts.length >= 9) {
				currentCommit = {
					hash: parts[0]!,
					abbrevHash: parts[1]!,
					author: { name: parts[2]!, email: parts[3]! },
					authorDate: parts[4]!,
					committer: { name: parts[5]!, email: parts[6]! },
					committerDate: parts[7]!,
					message: parts[8]!,
					parents: (parts[9] ?? '').split(' ').filter(Boolean),
				}
			}
			continue
		}

		// R100\told_path\tnew_path
		const renameMatch = trimmed.match(/^R(\d+)\t(.+?)\t(.+)$/)
		if (renameMatch && currentCommit) {
			results.push({
				commit: currentCommit,
				similarity: Number(renameMatch[1]!),
				from: renameMatch[2]!,
				to: renameMatch[3]!,
			})
			currentCommit = null
		}
	}

	return results
}
