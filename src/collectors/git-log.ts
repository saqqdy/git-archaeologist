/**
 * Git log collector — parses `git log --format` output into structured commit data
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { CommitInfo, LogQueryOptions, LogResult } from '../types'
import { GitCommandError } from '../errors'
import { cacheKey } from './git-cache'

const exec = promisify(execFile)

/**
 * Collect commit log with structured output.
 * Uses a custom format string with %x1E (RS) and %x1F (US) delimiters for reliable parsing.
 * These are ASCII record/unit separators — safe in execFile args, unlikely in commit messages.
 */
export async function collectLog(options: LogQueryOptions): Promise<LogResult> {
	const { root, log: logOpts = {}, cache } = options

	// Build a stable cache key from the filter options
	const key = cacheKey(
		'log',
		root,
		String(logOpts.maxCount ?? ''),
		logOpts.since ?? '',
		logOpts.until ?? '',
		logOpts.author ?? '',
		String(logOpts.merges ?? ''),
		(logOpts.paths ?? []).join(',')
	)
	if (cache) {
		const cached = cache.get<LogResult>(key)
		if (cached) return cached
	}

	const start = performance.now()

	// Use %x1E/%x1F — git expands these; safe to pass as string arg
	const args = ['log', '--format=%H%x1F%h%x1F%an%x1F%ae%x1F%aI%x1F%cn%x1F%ce%x1F%cI%x1F%s%x1E%P']

	if (logOpts.maxCount && logOpts.maxCount > 0) {
		args.push(`--max-count=${logOpts.maxCount}`)
	}
	if (logOpts.since) args.push(`--since=${logOpts.since}`)
	if (logOpts.until) args.push(`--until=${logOpts.until}`)
	if (logOpts.author) args.push(`--author=${logOpts.author}`)
	if (logOpts.merges === false) args.push('--no-merges')
	if (logOpts.follow && logOpts.paths?.length === 1) {
		args.push('--follow')
	}
	if (logOpts.paths?.length) {
		args.push('--', ...logOpts.paths)
	}

	try {
		const { stdout } = await exec('git', args, { cwd: root, maxBuffer: 100 * 1024 * 1024 })
		const commits = parseLogOutput(stdout)
		const truncated = logOpts.maxCount ? commits.length >= logOpts.maxCount : false
		const result = { commits, truncated, duration: Math.round(performance.now() - start) }
		if (cache) cache.set(key, result)
		return result
	} catch (err) {
		throw new GitCommandError({
			command: 'log',
			args,
			cwd: root,
			message: 'Failed to collect git log',
			cause: err instanceof Error ? err : undefined,
		})
	}
}

/** RS (Record Separator) used between format fields — git expands %x1F */
const FIELD_DELIM = '\x1F'
/** US (Unit Separator) used between subject and parents — git expands %x1E */
const COMMIT_DELIM = '\x1E'

/** Parse the custom format output into CommitInfo array */
function parseLogOutput(output: string): CommitInfo[] {
	const commits: CommitInfo[] = []
	const entries = output.split('\n').filter(line => line.trim())

	for (const entry of entries) {
		const parts = entry.split(FIELD_DELIM)
		if (parts.length < 8) continue

		const rawParents = (parts[9] ?? '').trim()
		const parents = rawParents ? rawParents.split(/\s+/) : []

		commits.push({
			hash: parts[0]!,
			abbrevHash: parts[1]!,
			author: { name: parts[2]!, email: parts[3]! },
			authorDate: parts[4]!,
			committer: { name: parts[5]!, email: parts[6]! },
			committerDate: parts[7]!,
			message: (parts[8] ?? '').replace(COMMIT_DELIM, ''),
			parents,
		})
	}

	return commits
}

/** Get a single commit by hash */
export async function getCommit(root: string, hash: string): Promise<CommitInfo | null> {
	try {
		const args = [
			'log',
			'--format=%H%x1F%h%x1F%an%x1F%ae%x1F%aI%x1F%cn%x1F%ce%x1F%cI%x1F%s%x1E%P',
			'--max-count=1',
			hash,
		]
		const { stdout } = await exec('git', args, { cwd: root })
		const commits = parseLogOutput(stdout)
		return commits[0] ?? null
	} catch {
		return null
	}
}
