# Skill Commands

Git Unearth provides interactive unearth commands in Claude Code.

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/why <file:line>` | Why was this code written? | `/why src/index.ts:42` |
| `/history <path>` | Evolution timeline | `/history src/components/` |
| `/context <hash>` | Related changes network | `/context abc1234` |
| `/decisions [area]` | Architecture Decision Records | `/decisions src/` |
| `/unearth <area>` | Deep interactive investigation | `/unearth src/` |

## `/why` — Trace Decision History

Understand the reason behind specific code.

**Usage**:
```
/why src/utils/format.ts:32
```

**Output**:
```
🔍 Analyzing formatDuration()...

📖 Reason Trace:
  1. [2024-06-10] Add formatDuration helper (def456)
     → Shared time formatting across reporters
  2. [2024-06-05] PR #42 → Issue #18
     → User reported unfriendly time display

💡 Conclusion: Utility function for consistent time display (🟢 High confidence)

💭 Follow up:
   - /history src/utils/format.ts
   - /context def456
```

## `/history` — Evolution Timeline

See how a file or directory evolved over time.

**Usage**:
```
/history src/collectors/git-blame.ts
```

**Output**:
```
📅 Evolution Timeline (git-blame.ts):

  2024-06-15 🔄 Fix porcelain parsing
    → abc123 - Handle edge case in RS/US delimiter

  2024-06-10 🌱 Initial implementation
    → def456 - Add line-level blame collection

🔑 Key Decisions:
  - Use RS/US delimiters for reliable parsing
  - Cache results at session level
```

## `/context` — Related Changes Network

Find commits related to a specific change.

**Usage**:
```
/context abc1234
```

**Output**:
```
🔍 Context Network for abc1234:

  Related Commits:
    def456 ← Previous: Add initial feature
    ghi789 → Next: Fix edge case
    jkl012 ↔ Parallel: Update tests

  Shared Files:
    src/index.ts (3 commits)
    src/utils.ts (2 commits)

  Influenced By:
    Issue #42 - User reported bug
    PR #43 - Refactoring
```

## `/decisions` — Architecture Decision Records

Extract ADRs from git history.

**Usage**:
```
/decisions src/
```

**Output**:
```
📋 Architecture Decisions (src/):

  1. [2024-06-10] Use RS/US delimiter parsing
     → Reliable git output parsing
     → Commit: def456

  2. [2024-06-05] Three-tier caching strategy
     → Performance optimization
     → Commit: abc123

  3. [2024-05-28] TypeScript-first API
     → Type safety and IDE support
     → Commit: ghi789
```

## `/unearth` — Deep Investigation

Interactive guided exploration of code history.

**Usage**:
```
/unearth src/auth/
```

**Interactive Session**:
```
🔬 Unearth Mode (src/auth/)

  I'll help you investigate src/auth/. What would you like to explore?

  1. Why does this code exist?
  2. How has it evolved?
  3. What are the key decisions?
  4. Are there any workarounds?
  5. Custom question

  Choose 1-5: _
```

## Confidence Levels

Commands return confidence levels based on evidence:

| Level | Source | Meaning |
|-------|--------|---------|
| 🟢 High | PR/Issue documentation | Verified business requirement |
| 🟡 Medium | Clear commit message | Explicit intent in commit |
| 🔴 Low | AI inference only | Pattern-based reasoning |

## Tips

### Effective Usage

1. **Start with `/why`** — Understand specific lines
2. **Use `/history` for context** — See the big picture
3. **Follow up with `/context`** — Discover relationships
4. **Extract `/decisions`** — Document architecture

### Combining Commands

Chain commands for deeper insights:

```
/why src/auth.ts:42
  → reveals commit abc123
/context abc123
  → shows related changes
/history src/auth.ts
  → shows evolution timeline
```

## Programmatic Access

All skill commands use the underlying API. You can achieve the same results programmatically:

```typescript
import { collectBlame, collectLog, createCacheStore } from 'git-unearth'

// Equivalent to /why
const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 42,
  endLine: 42,
  cache: createCacheStore(),
})

// Equivalent to /history
const log = await collectLog({
  root: process.cwd(),
  log: { paths: ['src/'] },
  cache: createCacheStore(),
})
```

See [API Reference](/api/) for full details.
