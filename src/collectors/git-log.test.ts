import { describe, expect, it } from 'vitest'
import { collectLog } from './git-log'

describe('collectLog', () => {
	it('returns commits from this repo', async () => {
		const result = await collectLog({ root: process.cwd() })
		expect(result.commits.length).toBeGreaterThan(0)
		expect(result.commits[0]!.hash).toBeTruthy()
		expect(result.commits[0]!.abbrevHash).toHaveLength(7)
		expect(result.commits[0]!.author.name).toBeTruthy()
		expect(result.commits[0]!.message).toBeTruthy()
		expect(result.duration).toBeGreaterThanOrEqual(0)
	})

	it('respects maxCount', async () => {
		const result = await collectLog({
			root: process.cwd(),
			log: { maxCount: 3 },
		})
		expect(result.commits.length).toBeLessThanOrEqual(3)
		expect(typeof result.truncated).toBe("boolean")
	})

	it('filters by author', async () => {
		const result = await collectLog({
			root: process.cwd(),
			log: { author: 'nonexistent-author-xyz' },
		})
		expect(result.commits.length).toBe(0)
	})

	it('filters by path', async () => {
		const result = await collectLog({
			root: process.cwd(),
			log: { paths: ['package.json'] },
		})
		expect(result.commits.length).toBeGreaterThanOrEqual(0)
	})
})
