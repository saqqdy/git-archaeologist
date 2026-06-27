import { describe, expect, it } from 'vitest'
import { cacheKey, createCacheStore } from './git-cache'

describe('createCacheStore', () => {
	it('stores and retrieves values from session cache', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: 60 })
		store.set('key1', { hello: 'world' })
		expect(store.get('key1')).toEqual({ hello: 'world' })
	})

	it('returns undefined for missing keys', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: 60 })
		expect(store.get('missing')).toBeUndefined()
	})

	it('has() works correctly', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: 60 })
		store.set('exists', 42)
		expect(store.has('exists')).toBe(true)
		expect(store.has('nope')).toBe(false)
	})

	it('delete() removes entries', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: 60 })
		store.set('temp', 'val')
		expect(store.delete('temp')).toBe(true)
		expect(store.get('temp')).toBeUndefined()
	})

	it('clear() empties the cache', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: 60 })
		store.set('a', 1)
		store.set('b', 2)
		store.clear()
		expect(store.get('a')).toBeUndefined()
		expect(store.get('b')).toBeUndefined()
	})

	it('respects TTL — expired entries return undefined', () => {
		const store = createCacheStore({ sessionCache: true, fsCache: false, cacheDir: '/tmp/test-cache', defaultTTL: -1 })
		store.set('will_expire', 'gone')
		expect(store.get('will_expire')).toBeUndefined()
	})
})

describe('cacheKey', () => {
	it('joins parts with colon', () => {
		expect(cacheKey('blame', 'src/index.ts')).toBe('blame:src/index.ts')
	})
})
