/**
 * Cache usage example for Git Archaeologist
 *
 * Demonstrates how to use caching to avoid redundant git operations.
 * Run with: npx tsx examples/with-cache.ts
 */

import {
	collectBlame,
	collectLog,
	collectCommitDetail,
	createCacheStore,
	cacheKey,
	formatDuration,
} from '../src/index'

const ROOT = process.cwd()

async function main() {
	console.log('💾 Git Archaeologist — Cache Usage Example\n')

	// Create a cache store with default config
	const cache = createCacheStore({
		sessionCache: true,
		fsCache: true,
		cacheDir: '.git-unearth',
		defaultTTL: 3600, // 1 hour
	})

	console.log('Cache created with:')
	console.log('  - Session cache: enabled')
	console.log('  - Filesystem cache: enabled')
	console.log('  - TTL: 1 hour\n')

	// ─── First call: cache miss ──────────────────────────────────────
	console.log('🔹 First call (cache miss):')
	const start1 = performance.now()

	const blame1 = await collectBlame({
		root: ROOT,
		file: 'internal/development-plan.md',
		cache,
	})

	const elapsed1 = performance.now() - start1
	console.log(`  Duration: ${formatDuration(Math.round(elapsed1))}`)
	console.log(`  Lines: ${blame1.lines.length}`)

	const cacheKey1 = cacheKey('blame', ROOT, 'package.json', '', '')
	console.log(`  Cached: ${cache.has(cacheKey1)}\n`)

	// ─── Second call: cache hit ───────────────────────────────────────
	console.log('🔹 Second call (cache hit):')
	const start2 = performance.now()

	const blame2 = await collectBlame({
		root: ROOT,
		file: 'internal/development-plan.md',
		cache,
	})

	const elapsed2 = performance.now() - start2
	console.log(`  Duration: ${formatDuration(Math.round(elapsed2))}`)
	console.log(`  Lines: ${blame2.lines.length}`)
	console.log(`  Speedup: ${Math.round(elapsed1 / elapsed2)}x faster!\n`)

	// ─── Cache operations ─────────────────────────────────────────────
	console.log('🔹 Cache operations:')
	console.log(`  has('${cacheKey1.slice(0, 30)}...'): ${cache.has(cacheKey1)}`)

	const cached = cache.get<{ lines: unknown[] }>(cacheKey1)
	console.log(`  get() returned: ${cached ? `${cached.lines.length} lines` : 'undefined'}`)

	const deleted = cache.delete(cacheKey1)
	console.log(`  delete(): ${deleted}`)
	console.log(`  has() after delete: ${cache.has(cacheKey1)}\n`)

	// ─── Cache with log queries ───────────────────────────────────────
	console.log('🔹 Cache with log queries:')

	const log = await collectLog({
		root: ROOT,
		log: { maxCount: 10 },
		cache,
	})

	console.log(`  Commits: ${log.commits.length}`)

	const log2 = await collectLog({
		root: ROOT,
		log: { maxCount: 10 },
		cache,
	})

	console.log(`  Second call (cached): ${log2.commits.length} commits\n`)

	// ─── Clear cache ──────────────────────────────────────────────────
	console.log('🔹 Clear cache:')
	cache.clear()
	console.log('  Cache cleared!')

	console.log('\n✅ Cache example completed!')
}

main().catch(console.error)
