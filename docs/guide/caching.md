# Caching

Git Unearth supports three-tier caching:

1. **Session Cache** — In-memory Map, fast but ephemeral
2. **Filesystem Cache** — Persisted to `.git-unearth/` directory
3. **None** — Fresh git calls every time

## Usage

```typescript
import { createCacheStore, collectBlame } from 'git-unearth'

const cache = createCacheStore({
  sessionCache: true,
  fsCache: true,
  cacheDir: '.git-unearth',
  defaultTTL: 3600, // 1 hour
})

// First call: cache miss
const blame1 = await collectBlame({ root, file: 'src/index.ts', cache })

// Second call: cache hit (10x faster)
const blame2 = await collectBlame({ root, file: 'src/index.ts', cache })
```

## Cache Operations

```typescript
cache.has(key)    // Check existence
cache.get(key)    // Retrieve value
cache.set(key, value, ttl)  // Store with optional TTL
cache.delete(key) // Remove entry
cache.clear()     // Clear all
```
