import { describe, expect, it } from 'vitest'
import { collectBlame, collectBlameSimple } from './git-blame'

/** A file we know exists in HEAD (committed as part of the docs) */
const COMMITTED_FILE = 'internal/development-plan.md'

describe('collectBlame', () => {
	it('blames a known file in this repo', async () => {
		const result = await collectBlame({
			root: process.cwd(),
			file: COMMITTED_FILE,
		})
		expect(result.file).toBe(COMMITTED_FILE)
		expect(result.lines.length).toBeGreaterThan(0)
		expect(result.lines[0]!.content).toBeTruthy()
		expect(result.lines[0]!.commit.hash).toBeTruthy()
		expect(result.lines[0]!.commit.author.name).toBeTruthy()
		expect(result.duration).toBeGreaterThanOrEqual(0)
	})

	it('blames a specific line range', async () => {
		const result = await collectBlame({
			root: process.cwd(),
			file: COMMITTED_FILE,
			startLine: 1,
			endLine: 3,
		})
		expect(result.lines.length).toBeLessThanOrEqual(3)
	})

	it('throws on non-existent file', async () => {
		await expect(
			collectBlame({ root: process.cwd(), file: 'nonexistent.ts' })
		).rejects.toThrow()
	})
})

describe('collectBlameSimple', () => {
	it('is an alias for collectBlame', () => {
		expect(collectBlameSimple).toBe(collectBlame)
	})
})
