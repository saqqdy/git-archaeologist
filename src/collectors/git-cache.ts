/**
 * Git cache — three-tier caching: session (Map) → filesystem → none
 */

import type { CacheConfig, CacheStore } from '../types'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/** Default cache configuration */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
	sessionCache: true,
	fsCache: true,
	cacheDir: '.git-unearth',
	defaultTTL: 86400, // 24h
}

/** Create a cache store with the given configuration */
export function createCacheStore(config: Partial<CacheConfig> = {}): CacheStore {
	const cfg = { ...DEFAULT_CACHE_CONFIG, ...config }
	const memoryCache = new Map<string, { value: unknown; expiresAt: number }>()

	return {
		get<T>(key: string): T | undefined {
			// Tier 1: Session cache
			if (cfg.sessionCache) {
				const entry = memoryCache.get(key)
				if (entry && entry.expiresAt > Date.now()) {
					return entry.value as T
				}
				if (entry) memoryCache.delete(key) // expired
			}

			// Tier 2: Filesystem cache
			if (cfg.fsCache) {
				const filePath = getCacheFilePath(cfg.cacheDir, key)
				try {
					if (existsSync(filePath)) {
						const raw = readFileSync(filePath, 'utf-8')
						const entry = JSON.parse(raw) as { value: unknown; expiresAt: number }
						if (entry.expiresAt > Date.now()) {
							// Promote to session cache
							if (cfg.sessionCache) {
								memoryCache.set(key, entry)
							}
							return entry.value as T
						}
						// Expired — clean up
						rmSync(filePath, { force: true })
					}
				} catch {
					// Corrupted cache file — ignore
				}
			}

			return undefined
		},

		set<T>(key: string, value: T, ttl?: number): void {
			const expiresAt = Date.now() + (ttl ?? cfg.defaultTTL) * 1000
			const entry = { value, expiresAt }

			if (cfg.sessionCache) {
				memoryCache.set(key, entry)
			}

			if (cfg.fsCache) {
				const filePath = getCacheFilePath(cfg.cacheDir, key)
				try {
					const dir = join(cfg.cacheDir, 'v')
					if (!existsSync(dir)) {
						mkdirSync(dir, { recursive: true })
					}
					writeFileSync(filePath, JSON.stringify(entry), 'utf-8')
				} catch {
					// Can't write cache — degrade gracefully
				}
			}
		},

		has(key: string): boolean {
			return this.get(key) !== undefined
		},

		delete(key: string): boolean {
			let deleted = memoryCache.delete(key)
			if (cfg.fsCache) {
				const filePath = getCacheFilePath(cfg.cacheDir, key)
				try {
					if (existsSync(filePath)) {
						rmSync(filePath, { force: true })
						deleted = true
					}
				} catch {
					// ignore
				}
			}
			return deleted
		},

		clear(): void {
			memoryCache.clear()
			if (cfg.fsCache && existsSync(cfg.cacheDir)) {
				try {
					rmSync(cfg.cacheDir, { recursive: true, force: true })
				} catch {
					// ignore
				}
			}
		},
	}
}

/** Generate a cache file path from a key */
function getCacheFilePath(cacheDir: string, key: string): string {
	// Use a simple hash to avoid filesystem issues with long/special chars
	const hash = stableHash(key)
	return join(cacheDir, 'v', `${hash}.json`)
}

/** Deterministic hash for cache keys — uses SHA-1 truncated to avoid collisions */
function stableHash(str: string): string {
	return createHash('sha1').update(str).digest('hex').slice(0, 16)
}

/** Create a prefixed cache key from parts */
export function cacheKey(...parts: string[]): string {
	return parts.join(':')
}
