import { describe, expect, it } from 'vitest'
import { formatCommitShort, formatDuration, formatLineBlame, truncate } from './format'
import type { CommitInfo, LineBlame } from '../types'

const mockCommit: CommitInfo = {
	hash: 'abcdef1234567890abcdef1234567890abcdef12',
	abbrevHash: 'abcdef1',
	author: { name: 'Test', email: 'test@example.com' },
	committer: { name: 'Test', email: 'test@example.com' },
	authorDate: '2024-06-15T10:00:00Z',
	committerDate: '2024-06-15T10:00:00Z',
	message: 'init commit',
	parents: [],
}

describe('formatCommitShort', () => {
	it('formats commit as one-liner', () => {
		const result = formatCommitShort(mockCommit)
		expect(result).toContain('abcdef1')
		expect(result).toContain('init commit')
		expect(result).toContain('Test')
	})
})

describe('formatLineBlame', () => {
	it('formats line blame as markdown', () => {
		const blame: LineBlame = {
			file: 'src/index.ts',
			line: 42,
			commit: mockCommit,
			content: 'export const x = 1',
		}
		const result = formatLineBlame(blame)
		expect(result).toContain('abcdef1')
		expect(result).toContain('2024-06-15')
		expect(result).toContain('src/index.ts')
		expect(result).toContain('42')
	})
})

describe('formatDuration', () => {
	it('formats milliseconds', () => {
		expect(formatDuration(500)).toBe('500ms')
	})
	it('formats seconds', () => {
		expect(formatDuration(5000)).toBe('5s')
	})
	it('formats minutes', () => {
		expect(formatDuration(120000)).toBe('2m')
	})
	it('formats minutes and seconds', () => {
		expect(formatDuration(90000)).toBe('1m 30s')
	})
})

describe('truncate', () => {
	it('does not truncate short strings', () => {
		expect(truncate('hello', 10)).toBe('hello')
	})
	it('truncates long strings', () => {
		expect(truncate('hello world', 8)).toBe('hello w…')
	})
})
