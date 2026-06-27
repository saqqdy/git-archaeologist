/**
 * Git diff collector — parses `git diff` / `git show` output into structured diff data
 */

import type {
	CommitDetail,
	CommitDiff,
	CommitInfo,
	DiffHunk,
	DiffOptions,
	FileDiff,
} from '../types'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { GitCommandError } from '../errors'
import { cacheKey } from './git-cache'
import { getCommit } from './git-log'

const exec = promisify(execFile)

/** Collect the diff for a specific commit */
export async function collectDiff(options: DiffOptions): Promise<CommitDiff> {
	const { root, hash, cache } = options

	// Check cache
	const key = cacheKey('diff', root, hash)
	if (cache) {
		const cached = cache.get<CommitDiff>(key)
		if (cached) return cached
	}

	const start = performance.now()

	try {
		const { stdout } = await exec(
			'git',
			['show', '--format=', '--patch', '--stat', '--no-color', hash],
			{
				cwd: root,
				maxBuffer: 100 * 1024 * 1024,
			}
		)

		const files = parseDiffOutput(stdout)
		const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0)
		const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0)

		const result = {
			hash,
			files,
			totalAdditions,
			totalDeletions,
			duration: Math.round(performance.now() - start),
		}
		if (cache) cache.set(key, result)
		return result
	} catch (err) {
		throw new GitCommandError({
			command: 'show',
			args: [hash],
			cwd: root,
			message: `Failed to collect diff for ${hash}`,
			cause: err instanceof Error ? err : undefined,
		})
	}
}

/** Collect diff between two commits */
export async function collectDiffBetween(
	root: string,
	from: string,
	to: string
): Promise<CommitDiff> {
	const start = performance.now()

	const { stdout } = await exec('git', ['diff', '--patch', '--stat', '--no-color', from, to], {
		cwd: root,
		maxBuffer: 100 * 1024 * 1024,
	})

	const files = parseDiffOutput(stdout)
	const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0)
	const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0)

	return {
		hash: `${from}..${to}`,
		files,
		totalAdditions,
		totalDeletions,
		duration: Math.round(performance.now() - start),
	}
}

/** Parse unified diff output into structured FileDiff array */
function parseDiffOutput(output: string): FileDiff[] {
	const files: FileDiff[] = []
	const lines = output.split('\n')

	let i = 0

	while (i < lines.length) {
		// Find diff header: "diff --git a/path b/path"
		if (!lines[i]!.startsWith('diff --git')) {
			i++
			continue
		}

		const result = parseOneFile(lines, i)
		if (result) {
			files.push(result.file)
			i = result.nextIndex
		} else {
			i++
		}
	}

	return files
}

/** Parse a single file diff starting at the given line index */
function parseOneFile(
	lines: string[],
	start: number
): { file: FileDiff; nextIndex: number } | null {
	let i = start + 1,
		file = '' as string,
		from = '' as string,
		status: FileDiff['status'] = 'modified',
		additions = 0,
		deletions = 0,
		renameTo = ''
	const hunks: DiffHunk[] = []

	// Parse header lines
	while (i < lines.length && !lines[i]!.startsWith('@@')) {
		const line = lines[i]!
		if (line.startsWith('--- a/')) {
			from = line.slice(6)
		} else if (line.startsWith('--- /dev/null')) {
			status = 'added'
		} else if (line.startsWith('+++ b/')) {
			file = line.slice(6)
		} else if (line.startsWith('+++ /dev/null')) {
			status = 'deleted'
		} else if (line.startsWith('rename from ')) {
			from = line.slice(12)
			status = 'renamed'
		} else if (line.startsWith('rename to ')) {
			renameTo = line.slice(10)
			status = 'renamed'
		}
		i++
	}

	if (!file && from) file = from
	if (renameTo) file = renameTo

	// Parse hunks
	while (i < lines.length && lines[i]!.startsWith('@@')) {
		const hunkResult = parseOneHunk(lines, i)
		if (hunkResult) {
			hunks.push(hunkResult.hunk)
			additions += hunkResult.additions
			deletions += hunkResult.deletions
			i = hunkResult.nextIndex
		} else {
			i++
		}

		// If we hit the next file diff, break
		if (i < lines.length && lines[i]!.startsWith('diff --git')) break
	}

	if (!file) return null

	return {
		file: {
			file,
			from: status === 'renamed' ? from : undefined,
			status,
			additions,
			deletions,
			hunks,
		},
		nextIndex: i,
	}
}

/** Collect full commit detail: metadata + diff */
export async function collectCommitDetail(options: DiffOptions): Promise<CommitDetail> {
	const { root, hash, cache } = options

	// Check cache
	const key = cacheKey('detail', root, hash)
	if (cache) {
		const cached = cache.get<CommitDetail>(key)
		if (cached) return cached
	}

	const start = performance.now()

	const [commit, diff] = await Promise.all([getCommit(root, hash), collectDiff(options)])

	// If getCommit couldn't resolve, build a minimal CommitInfo from the hash
	const commitInfo: CommitInfo = commit ?? {
		hash,
		abbrevHash: hash.slice(0, 7),
		author: { name: '', email: '' },
		committer: { name: '', email: '' },
		authorDate: '',
		committerDate: '',
		message: '',
		parents: [],
	}

	const result = {
		commit: commitInfo,
		diff,
		duration: Math.round(performance.now() - start),
	}
	if (cache) cache.set(key, result)
	return result
}

/** Parse a single hunk starting at the @@ line */
function parseOneHunk(
	lines: string[],
	start: number
): { hunk: DiffHunk; additions: number; deletions: number; nextIndex: number } | null {
	const header = lines[start]!
	const hunkMatch = header.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/)
	if (!hunkMatch) return null

	const oldStart = Number(hunkMatch[1]!)
	const oldCount = Number(hunkMatch[2] ?? '1')
	const newStart = Number(hunkMatch[3]!)
	const newCount = Number(hunkMatch[4] ?? '1')

	const hunkLines: string[] = []
	let additions = 0,
		deletions = 0,
		i = start + 1

	while (i < lines.length) {
		const line = lines[i]!
		if (line.startsWith('@@') || line.startsWith('diff --git')) break
		if (line.startsWith('+')) additions++
		else if (line.startsWith('-')) deletions++
		hunkLines.push(line)
		i++
	}

	return {
		hunk: { header, oldStart, oldCount, newStart, newCount, lines: hunkLines },
		additions,
		deletions,
		nextIndex: i,
	}
}
