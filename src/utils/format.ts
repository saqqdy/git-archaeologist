/**
 * Formatting utility functions
 */

import type { CommitInfo, FileDiff, LineBlame, RenameEvent } from '../types'

/** Format a CommitInfo as a short one-liner */
export function formatCommitShort(c: CommitInfo): string {
	return `\`${c.abbrevHash}\` ${c.message} — ${c.author.name}`
}

/** Format a LineBlame as Markdown list item */
export function formatLineBlame(blame: LineBlame): string {
	const line = `:${blame.line}`
	return `- \`${blame.commit.abbrevHash}\` [${blame.commit.authorDate.slice(0, 10)}] \`${blame.file}${line}\` ${blame.commit.message}`
}

/** Format a FileDiff as Markdown list item */
export function formatFileDiff(diff: FileDiff): string {
	const status = diff.status === 'added' ? '➕' : diff.status === 'deleted' ? '❌' : diff.status === 'renamed' ? '📦' : '📝'
	const loc = `+${diff.additions}/-${diff.deletions}`
	const rename = diff.status === 'renamed' && diff.from ? ` (${diff.from} → ${diff.file})` : ''
	return `- ${status} \`${diff.file}\` ${loc}${rename}`
}

/** Format a RenameEvent as Markdown */
export function formatRename(rename: RenameEvent): string {
	return `- \`${rename.from}\` → \`${rename.to}\` (${rename.similarity}%) by ${rename.commit.author.name} in \`${rename.commit.abbrevHash}\``
}

/** Format duration in ms to human-readable */
export function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms}ms`
	const seconds = Math.round(ms / 1000)
	if (seconds < 60) return `${seconds}s`
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
}

/** Truncate a string to maxLen, adding ellipsis if needed */
export function truncate(str: string, maxLen: number): string {
	if (str.length <= maxLen) return str
	return `${str.slice(0, maxLen - 1)  }…`
}
