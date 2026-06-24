/**
 * Git blame collector — parses `git blame --line-porcelain` output
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { BlameOptions, CommitInfo, FileBlame, LineBlame } from '../types'
import { GitCommandError } from '../errors'
import { cacheKey } from './git-cache'

const exec = promisify(execFile)

/**
 * Collect blame for a file using `git blame --line-porcelain`.
 *
 * This parses the full porcelain output line-by-line:
 *   - Header lines: `<hash> <origLine> <finalLine> [<numLines>]`
 *   - Metadata lines: `key value` (author, author-mail, summary, etc.)
 *   - Content lines: `\t<actual source line>`
 *
 * Each header starts a new blame entry; content ends it.
 */
export async function collectBlame(options: BlameOptions): Promise<FileBlame> {
	const { root, file, startLine, endLine, cache } = options

	// Check cache first
	const key = cacheKey('blame', root, file, String(startLine ?? ''), String(endLine ?? ''))
	if (cache) {
		const cached = cache.get<FileBlame>(key)
		if (cached) return cached
	}

	const start = performance.now()

	const args = ['blame', '--line-porcelain']
	if (startLine != null) {
		const range = endLine != null ? `${startLine},${endLine}` : `${startLine},`
		args.push('-L', range)
	}
	args.push('--', file)

	try {
		const { stdout } = await exec('git', args, { cwd: root, maxBuffer: 50 * 1024 * 1024 })
		const result = parsePorcelainOutput(stdout, file, start)
		if (cache) cache.set(key, result)
		return result
	} catch (err) {
		throw new GitCommandError({
			command: 'blame',
			args,
			cwd: root,
			message: `Failed to blame ${file}`,
			cause: err instanceof Error ? err : undefined,
		})
	}
}

/** Simplified alias — same implementation, easier to remember */
export const collectBlameSimple = collectBlame

// ─── Parser ────────────────────────────────────────────────────────

function parsePorcelainOutput(stdout: string, file: string, startTime: number): FileBlame {
	const commitMap = new Map<string, CommitInfo>()
	const lines: LineBlame[] = []

	let currentHash = ''
	let currentLineNum = 0

	for (const rawLine of stdout.split('\n')) {
		// Header line: <40-hex-hash> <origLine> <finalLine> [<numLines>]
		const headerMatch = rawLine.match(/^([0-9a-f]{40})\s+(\d+)\s+(\d+)/)
		if (headerMatch) {
			currentHash = headerMatch[1]!
			currentLineNum = Number(headerMatch[3]!)
			if (!commitMap.has(currentHash)) {
				commitMap.set(currentHash, createEmptyCommit(currentHash))
			}
			continue
		}

		// Metadata key-value lines (author, summary, etc.)
		const kvMatch = rawLine.match(/^([a-z][\w-]*)\s+(.+)$/i)
		if (kvMatch && currentHash) {
			const [, key, value] = kvMatch
			const commit = commitMap.get(currentHash)!
			applyMetadata(commit, key!, value!)
			continue
		}

		// Tab-prefixed content line — this completes the current blame entry
		if (rawLine.startsWith('\t') && currentHash) {
			const commit = commitMap.get(currentHash)!
			lines.push({
				file,
				line: currentLineNum,
				commit,
				content: rawLine.slice(1),
			})
			// Reset so stray metadata between entries is ignored
			currentHash = ''
		}
	}

	return { file, lines, duration: Math.round(performance.now() - startTime) }
}

// ─── Helpers ───────────────────────────────────────────────────────

function createEmptyCommit(hash: string): CommitInfo {
	return {
		hash,
		abbrevHash: hash.slice(0, 7),
		author: { name: '', email: '' },
		committer: { name: '', email: '' },
		authorDate: '',
		committerDate: '',
		message: '',
		parents: [],
	}
}

function applyMetadata(commit: CommitInfo, key: string, value: string): void {
	switch (key) {
		case 'author':
			commit.author.name = value
			break
		case 'author-mail':
			commit.author.email = value.replace(/[<>]/g, '')
			break
		case 'author-time':
			commit.authorDate = new Date(Number(value) * 1000).toISOString()
			break
		case 'committer':
			commit.committer.name = value
			break
		case 'committer-mail':
			commit.committer.email = value.replace(/[<>]/g, '')
			break
		case 'committer-time':
			commit.committerDate = new Date(Number(value) * 1000).toISOString()
			break
		case 'summary':
			commit.message = value
			break
		case 'parent':
			commit.parents.push(value)
			break
	}
}
