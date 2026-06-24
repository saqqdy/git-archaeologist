import { describe, expect, it } from 'vitest'
import { collectDiff } from './git-diff'
import { collectLog } from './git-log'

describe('collectDiff', () => {
	it('returns diff for a commit in this repo', async () => {
		const log = await collectLog({ root: process.cwd(), log: { maxCount: 1 } })
		const latest = log.commits[0]
		if (!latest) return

		const result = await collectDiff({ root: process.cwd(), hash: latest.hash })
		expect(result.hash).toBe(latest.hash)
		expect(result.files.length).toBeGreaterThanOrEqual(0)
		expect(result.totalAdditions).toBeGreaterThanOrEqual(0)
		expect(result.totalDeletions).toBeGreaterThanOrEqual(0)
		expect(result.duration).toBeGreaterThanOrEqual(0)
	})
})
