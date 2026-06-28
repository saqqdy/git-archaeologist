# Quick Start

## Using the Skill

In Claude Code, run:

```
/why src/index.ts:42
```

Output:
```
🔍 分析 `src/index.ts:42` 中的 ...

📖 原因追溯：
  1. [2024-06-15] Add error handling (abc123)
     → Prevents crash on invalid input
  2. [2024-05-20] PR #42 → Issue #18
     → Customer reported crash on edge case

💡 结论：错误处理是为了防止边界情况崩溃 (🟢 高置信度)
```

## Using the API

```typescript
import { collectBlame, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 42,
  endLine: 50,
  cache,
})

console.log(`Lines: ${blame.lines.length}`)
console.log(`Duration: ${blame.duration}ms`)
```
