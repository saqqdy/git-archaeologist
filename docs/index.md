# 🔍 Git Unearth

> AI-powered git blame enhancer — understand **WHY** code was written, not just **WHO** wrote it.

[![npm version](https://img.shields.io/npm/v/git-unearth.svg)](https://www.npmjs.com/package/git-unearth)
[![license](https://img.shields.io/npm/l/git-unearth.svg)](https://github.com/saqqdy/git-unearth/blob/master/LICENSE)

## Quick Links

- [Installation](/guide/installation) — Get started in minutes
- [Quick Start](/guide/quick-start) — See it in action
- [API Reference](/api/) — Programmatic usage
- [Skill Commands](/guide/skill-commands) — Interactive unearth

## The Problem

Traditional `git blame` tells you **who** and **when**, but not **why**:

```
src/index.ts:42  alice  2024-06-15  abc123
```

Questions it can't answer:
- Why does this code exist?
- What business requirement drove it?
- Is this intentional or a workaround?
- How did it evolve over time?

## The Solution

Git Unearth traces **decision history** through three layers:

| Layer | Capability | Output |
|-------|------------|--------|
| **Data Collection** | Parse git commands into structured data | `CommitInfo`, `FileBlame`, `FileDiff` |
| **Semantic Analysis** | Group commits, classify intent | Commit groups, decision points |
| **Narrative Generation** | Explain with evidence chains | Confidence: 🟢 High / 🟡 Medium / 🔴 Low |

## Key Features

### 🔍 Git Data Collection

Structured parsing with zero configuration:

- **Line-level blame** — `collectBlame()` with commit metadata
- **Commit history** — `collectLog()` with RS/US delimiter parsing
- **Unified diffs** — `collectDiff()` / `collectDiffBetween()`
- **Rename tracking** — `collectFollow()` for file evolution
- **Full commit detail** — `collectCommitDetail()` in one call

### 💾 Three-Tier Caching

Session → Filesystem → None. Eliminate redundant git operations.

### 🧠 Semantic Analysis

- Commit grouping by merge/PR/time window
- Intent classification: feat/fix/refactor/perf/workaround
- Decision timeline construction

### 🔄 Interactive Commands

In Claude Code, use natural language unearth:

| Command | Purpose |
|---------|---------|
| `/why <file:line>` | Why was this code written? |
| `/history <path>` | Evolution timeline |
| `/context <hash>` | Related changes network |
| `/decisions` | Architecture Decision Records |

## Confidence Levels

| Level | Source | Meaning |
|-------|--------|---------|
| 🟢 **High** | PR/Issue documentation | Verified business requirement |
| 🟡 **Medium** | Clear commit message | Explicit intent in commit |
| 🔴 **Low** | AI inference only | Pattern-based reasoning |

## Example Output

```
/why src/utils/format.ts:32

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

## Comparison

| Dimension | git blame | Git Unearth |
|-----------|-----------|-------------|
| Output | `author date code` | Structured `CommitInfo` + evidence chain |
| **Why?** | ❌ No | ✅ Trace PR/Issue/business context |
| **Grouping** | ❌ No | ✅ Commit groups, decision points |
| **Confidence** | ❌ No | ✅ 🟢🟡🔴 levels |
| **Caching** | ❌ No | ✅ Three-tier cache |
| **API** | ❌ No | ✅ TypeScript/Node.js API |

## Get Started

Choose your path:

### 1. Claude Code Plugin (Recommended)

```bash
# Plugin marketplace
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

### 2. NPM Package

```bash
pnpm add git-unearth
```

### 3. CLI (Zero-Install)

```bash
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
```

### 4. Clone & Explore

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install
npx tsx examples/basic-usage.ts
```

## Project Status

| Version | Theme | Status |
|---------|-------|--------|
| v0.1.0 | Data collection layer | ✅ Released |
| v0.2.0 | Analysis engine | 📋 Planned |
| v0.3.0 | Decision timeline + ADR | 📋 Planned |
| v1.0.0 | Production-ready | 📋 Planned |

See [Roadmap](/guide/roadmap) for details.

## License

MIT — use freely in personal and commercial projects.
