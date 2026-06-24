import { describe, expect, it } from 'vitest'
import { collectFollow } from './git-follow'

describe('collectFollow', () => {
	it('returns rename history for a file', async () => {
		const result = await collectFollow({
			root: process.cwd(),
			file: 'package.json',
		})
		expect(result.currentPath).toBe('package.json')
		expect(result.originalPath).toBeTruthy()
		expect(Array.isArray(result.renames)).toBe(true)
		expect(result.duration).toBeGreaterThanOrEqual(0)
	})
})
