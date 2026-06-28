# Quick Start

## Using the Skill

In Claude Code, run:

```
/why src/index.ts:42
```

Output:

```
🔍 Analyzing src/index.ts:42...

📖 Reason Trace:
  1. [2024-06-15] Add error handling (abc123)
     → Prevents crash on invalid input
  2. [2024-05-20] PR #42 → Issue #18
     → Customer reported crash on edge case

💡 Conclusion: Error handling added to prevent edge case crashes (🟢 High confidence)

💭 Follow up:
   - /history src/utils/format.ts
   - /context abc123
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

## CLI Usage

```bash
# Line-level blame
npx git-unearth blame src/index.ts --start-line 1 --end-line 10

# Commit history
npx git-unearth log --max-count 20 --paths src/

# File rename tracking
npx git-unearth follow src/index.ts

# Full commit detail
npx git-unearth detail abc1234
```
