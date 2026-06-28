# 🔍 Git Unearth

> AI-powered git blame enhancer — understand **WHY** code was written, not just **WHO** wrote it. Semantic code unearth via Claude Code Skill.

[![npm version](https://img.shields.io/npm/v/git-unearth.svg)](https://www.npmjs.com/package/git-unearth)
[![license](https://img.shields.io/npm/l/git-unearth.svg)](https://github.com/saqqdy/git-unearth/blob/master/LICENSE)

[中文文档](README_CN.md)

---

## 🎯 The Problem It Solves

| Scenario | Traditional git blame | Git Unearth |
|----------|----------------------|-------------------|
| "Why this line?" | `alice 2024-06-15` — tells you who, but not why | Traces commit → PR → Issue → business context |
| "Why this pattern?" | No insight | Groups related commits, identifies decision points |
| "Was this intentional?" | Unknown | Confidence levels: 🟢 High (documented) 🟡 Medium (clear commit) 🔴 Low (AI inference) |

**Core insight**: Code unearth requires understanding **decision history**, not just author history.

---

## ✨ Core Features

### 🔍 Git Data Collection Layer (v0.1.1)

Structured parsing of git command output:

- **`collectBlame()`** — Line-level blame with commit metadata
- **`collectLog()`** — Commit history with RS/US delimiter parsing
- **`collectDiff()`** / **`collectDiffBetween()`** — Unified diff with hunks
- **`collectFollow()`** — File rename tracking
- **`collectCommitDetail()`** — Full commit + diff in one call

### 💾 Three-Tier Caching

Session (Map) → Filesystem → None. Avoid redundant git operations.

### 🧠 Semantic Analysis (v0.2.0+)

- Commit grouping (merge/PR/time window)
- Intent classification (feat/fix/refactor/perf/workaround)
- Decision timeline construction

### 🔄 Interactive Unearth Commands

| Command | Description |
|---------|-------------|
| `/why <file:line>` | Why was this code written? Trace decision history |
| `/history <path>` | Evolution timeline with key decision points |
| `/context <hash>` | Related changes network |
| `/decisions [area]` | Architecture Decision Records from git history |
| `/unearth <area>` | Deep interactive investigation |

---

## 🚀 Getting Started

### Option 1: Claude Code Plugin (Recommended)

This project is a **Claude Code Plugin**. Install via marketplace for one-click setup.

#### Method A: Plugin Marketplace (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

#### Method B: Local Install

```bash
# 1. Go to your project
cd your-project

# 2. Install npm package
pnpm add -D git-unearth

# 3. Copy plugin files
mkdir -p .claude/skills
cp -r node_modules/git-unearth/.claude/skills/git-unearth .claude/skills/
```

#### Available Commands

Type these commands in Claude Code:

| Command | Description | Example |
|---------|-------------|---------|
| `/why` | Why was this code written? | `/why src/index.ts:42` |
| `/history` | Evolution timeline | `/history src/components/` |
| `/context` | Related changes network | `/context HEAD` |
| `/decisions` | Architecture Decision Records | `/decisions` |
| `/unearth` | Deep interactive investigation | `/unearth src/` |

#### Output Example

```
/why src/utils/format.ts:32

🔍 Analyzing `formatDuration()` ...

📖 Reason Trace:
  1. [2024-06-10] Add formatDuration helper (def456)
     → Shared time formatting across reporters
  2. [2024-06-05] PR #42 → Issue #18
     → User reported unfriendly time display

💡 Conclusion: Utility function added for consistent time display (🟢 High confidence)

💭 Follow up:
   - /history src/utils/format.ts
   - /context def456
```

### Option 2: Programmatic Usage

```bash
pnpm add git-unearth
```

```typescript
import {
  collectBlame, collectLog, collectCommitDetail, collectFollow,
  createCacheStore,
} from 'git-unearth'

const cache = createCacheStore({ sessionCache: true, fsCache: true })

// Get line-level blame
const blame = await collectBlame({
  root: process.cwd(), file: 'src/index.ts', startLine: 1, endLine: 10, cache,
})

for (const line of blame.lines) {
  console.log(`${line.line}: ${line.commit.message} (${line.commit.author.name})`)
}

// Get commit history
const log = await collectLog({
  root: process.cwd(), log: { maxCount: 20, paths: ['src/'] }, cache,
})

// Full commit detail
const detail = await collectCommitDetail({
  root: process.cwd(), hash: log.commits[0].hash, cache,
})

console.log(`${detail.commit.message}`)
console.log(`+${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
```

### Option 3: CLI (Zero-Install)

```bash
# In any git repo, run directly:
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
npx git-unearth diff abc1234
npx git-unearth follow src/index.ts
npx git-unearth detail abc1234
npx git-unearth help
```

### Option 4: Clone and Run Examples

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

---

## 📋 Version Roadmap

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| v0.1.0 | Daybreak | Data collection layer (released) (blame/log/diff/follow + cache) | ✅ Current |
| v0.2.0 | Sunrise | Analysis engine (commit grouping + intent classification) | 📋 Planned |
| v0.3.0 | Dawn | Decision timeline + ADR generation | 📋 Planned |
| v0.4.0 | Ember | Interactive unearth wizard | 📋 Planned |
| v1.0.0 | Lighthouse | Production-ready + marketplace | 📋 Planned |

---

## 🗂️ Project Structure

```
git-unearth/
├── .claude/skills/git-unearth/   # Skill prompts (core product)
│   └── skill.md                        # Commands + execution flow
├── src/                                # TypeScript source
│   ├── index.ts                        # Public API exports
│   ├── types.ts                        # Core types
│   ├── errors.ts                       # GitCommandError, GitParseError
│   ├── collectors/                     # Git data collectors
│   │   ├── git-blame.ts                # Line-level blame
│   │   ├── git-log.ts                  # Commit history
│   │   ├── git-diff.ts                 # Unified diff
│   │   ├── git-follow.ts               # Rename tracking
│   │   └── git-cache.ts                # Three-tier cache
│   └── utils/                          # Utilities
│       ├── config.ts                   # Config management
│       └── format.ts                   # Output formatting
├── examples/                           # Usage examples
├── docs/                               # VitePress docs
└── internal/                           # Planning docs
```

---

## 🛠️ Development

```bash
pnpm install          # Install dependencies
pnpm run lint         # ESLint + auto-fix
pnpm run typecheck    # TypeScript check
pnpm run test         # Run tests (vitest)
pnpm run build        # Build (ESM + CJS)
pnpm run docs:dev     # Start docs server
```

---

## 🆚 Comparison

### vs git blame

| Dimension | git blame | Git Unearth |
|-----------|-----------|-------------------|
| Output | `author date code` | Structured `CommitInfo` + evidence chain |
| Why? | ❌ No | ✅ Trace PR/Issue/business context |
| Grouping | ❌ No | ✅ Commit groups, decision points |
| Confidence | ❌ No | ✅ 🟢🟡🔴 levels |
| Caching | ❌ No | ✅ Three-tier cache |

---

## 📄 License

[MIT](./LICENSE)
