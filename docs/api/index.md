# API Reference

Complete TypeScript/Node.js API for git unearth.

## Core Functions

### Data Collection

| Function | Description | Returns |
|----------|-------------|---------|
| [`collectBlame()`](/api/collect-blame) | Line-level blame with commit metadata | `FileBlame` |
| [`collectLog()`](/api/collect-log) | Commit history with structured parsing | `CommitInfo[]` |
| [`collectDiff()`](/api/collect-diff) | Diff for a specific commit | `FileDiff` |
| [`collectDiffBetween()`](/api/collect-diff) | Diff between two commits | `FileDiff[]` |
| [`collectFollow()`](/api/collect-follow) | File rename tracking | `RenameHistory` |
| [`collectCommitDetail()`](/api/collect-commit-detail) | Full commit metadata + diff | `CommitDetail` |
| [`getCommit()`](/api/collect-commit-detail) | Single commit lookup | `CommitInfo` |

### Cache Management

| Function | Description | Returns |
|----------|-------------|---------|
| [`createCacheStore()`](/api/create-cache-store) | Create cache store instance | `CacheStore` |

## Error Handling

| Class | Description | Properties |
|-------|-------------|------------|
| `GitCommandError` | Git command execution failed | `command`, `exitCode`, `stderr` |
| `GitParseError` | Parsing git output failed | `output`, `parseError` |

## Common Patterns

### Basic Blame

```typescript
import { collectBlame, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 1,
  endLine: 10,
  cache,
})

for (const line of blame.lines) {
  console.log(`${line.line}: ${line.commit.message} (${line.commit.author.name})`)
}
```

### Commit History

```typescript
import { collectLog, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const log = await collectLog({
  root: process.cwd(),
  log: {
    maxCount: 20,
    paths: ['src/'],
  },
  cache,
})

console.log(`Found ${log.commits.length} commits`)
```

### Full Commit Detail

```typescript
import { collectCommitDetail, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const detail = await collectCommitDetail({
  root: process.cwd(),
  hash: 'abc1234',
  cache,
})

console.log(`${detail.commit.message}`)
console.log(`+${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
```

### File Evolution

```typescript
import { collectFollow, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const history = await collectFollow({
  root: process.cwd(),
  file: 'src/index.ts',
  cache,
})

console.log(`File had ${history.renames.length} renames`)
for (const rename of history.renames) {
  console.log(`${rename.oldPath} → ${rename.newPath}`)
}
```

### Diff Analysis

```typescript
import { collectDiff, collectDiffBetween, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

// Single commit diff
const diff1 = await collectDiff({
  root: process.cwd(),
  hash: 'abc1234',
  cache,
})

// Diff between two commits
const diff2 = await collectDiffBetween({
  root: process.cwd(),
  fromHash: 'abc1234',
  toHash: 'def5678',
  cache,
})
```

## Type Safety

All APIs are fully typed with TypeScript:

```typescript
import type {
  FileBlame,
  CommitInfo,
  FileDiff,
  RenameHistory,
  CommitDetail,
  CacheStore,
  CacheOptions,
} from 'git-unearth'
```

See [Types](/api/types/) for detailed type definitions.

## Performance

### Caching Strategy

Three-tier cache hierarchy:

1. **Session Cache** — In-memory Map, fastest but ephemeral
2. **Filesystem Cache** — Persisted to `.git-unearth/`, survives restarts
3. **None** — Fresh git calls, always accurate but slower

Recommended: Enable both session and filesystem cache for optimal performance.

### Benchmarks

| Operation | Without Cache | With Session Cache | Improvement |
|-----------|---------------|--------------------|-------------|
| `collectBlame()` (100 lines) | ~150ms | ~15ms | 10x faster |
| `collectLog()` (100 commits) | ~200ms | ~20ms | 10x faster |
| `collectCommitDetail()` | ~300ms | ~30ms | 10x faster |

## Error Handling

```typescript
import { GitCommandError, GitParseError } from 'git-unearth'

try {
  const blame = await collectBlame({ root, file, cache })
} catch (error) {
  if (error instanceof GitCommandError) {
    console.error(`Git command failed: ${error.command}`)
    console.error(`Exit code: ${error.exitCode}`)
    console.error(`stderr: ${error.stderr}`)
  } else if (error instanceof GitParseError) {
    console.error(`Parse error: ${error.parseError}`)
    console.error(`Output: ${error.output}`)
  }
}
```

## Configuration

### Cache Options

```typescript
interface CacheOptions {
  sessionCache?: boolean    // Enable in-memory cache (default: false)
  fsCache?: boolean         // Enable filesystem cache (default: false)
  cacheDir?: string         // Cache directory (default: '.git-unearth')
  defaultTTL?: number       // Default TTL in seconds (default: 3600)
}
```

### Collector Options

All collectors share common options:

```typescript
interface CollectorOptions {
  root: string              // Git repository root
  cache?: CacheStore        // Cache store instance
}
```

## CLI Reference

```bash
# Blame
npx git-unearth blame <file> [--start-line N] [--end-line N]

# Log
npx git-unearth log [--max-count N] [--paths path1,path2]

# Diff
npx git-unearth diff <hash>

# Follow
npx git-unearth follow <file>

# Commit Detail
npx git-unearth detail <hash>

# Help
npx git-unearth help
```

## Integration Examples

### With Testing Framework

```typescript
import { collectBlame } from 'git-unearth'
import { describe, it, expect } from 'vitest'

describe('Git History', () => {
  it('should have valid commit metadata', async () => {
    const blame = await collectBlame({
      root: process.cwd(),
      file: 'src/index.ts',
      startLine: 1,
      endLine: 10,
    })
    
    for (const line of blame.lines) {
      expect(line.commit.hash).toMatch(/^[a-f0-9]{7,40}$/)
      expect(line.commit.author.name).toBeTruthy()
      expect(line.commit.author.email).toBeTruthy()
    }
  })
})
```

### With CI/CD

```yaml
# GitHub Actions example
name: Code Unearth
on: [pull_request]

jobs:
  unearth:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx git-unearth blame src/index.ts
      - run: npx git-unearth log --max-count 20
```

## Next Steps

- Explore individual function documentation
- Check type definitions for detailed interfaces
- See [Caching Guide](/guide/caching) for cache strategies
