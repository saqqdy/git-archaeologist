# Changelog

## 0.1.1 (2026-06-28)

### 🔄 Project Rename

- **branding**: rename project from "Git Archaeologist" to "Git Unearth"
  - Update all source code references: `ArchaeologistConfig` → `UnearthConfig`
  - Update CLI branding: `Git Archaeologist` → `Git Unearth`
  - Update config file name: `.gitarchaeologistrc` → `.git-unearthrc`
  - Update all documentation and examples

### 📝 Documentation Enhancement

- **docs**: comprehensive documentation optimization
  - Enhanced landing page with feature comparison and confidence levels
  - Improved installation guide with marketplace instructions
  - Fixed quick-start guide (removed Chinese output from English docs)
  - Expanded roadmap with detailed version plans
  - Enhanced skill-commands with English examples
  - Comprehensive API reference with usage patterns
  - Updated VitePress config with correct project branding

- **examples**: update example files
  - `examples/basic-usage.ts` — updated project name
  - `examples/skill-commands.ts` — updated project name
  - `examples/with-cache.ts` — updated project name


## 0.1.0 (2026-06-27)

### 🚀 Features

- **cli**: add zero-install CLI for quick experience
  - `npx git-unearth blame <file>` — line-level blame
  - `npx git-unearth log --max-count N` — commit history
  - `npx git-unearth diff <hash>` — diff for a commit
  - `npx git-unearth follow <file>` — rename tracking
  - `npx git-unearth detail <hash>` — full commit detail
- **collectors**: add git data collection layer with blame, log, diff, follow support
  - `collectBlame()` — parse `git blame --line-porcelain` into structured line-level data
  - `collectLog()` — parse `git log` with RS/US delimiters into `CommitInfo[]`
  - `collectDiff()` / `collectDiffBetween()` — parse unified diff into `FileDiff[]` with hunks
  - `collectFollow()` — track file renames via `git log --follow --diff-filter=R`
  - `collectCommitDetail()` — full commit metadata + diff in one call
  - `getCommit()` — single commit lookup by hash
- **cache**: add three-tier caching (session Map → filesystem → none) with SHA-1 key hashing
  - `createCacheStore()` with configurable TTL, session/fs toggle
  - All collectors accept optional `cache` parameter for automatic caching
- **errors**: add structured error classes `GitCommandError` and `GitParseError`
- **format**: add formatting utilities — `formatCommitShort`, `formatLineBlame`, `formatFileDiff`, `formatRename`, `formatDuration`, `truncate`
- **config**: add `getDefaultConfig()` / `mergeConfig()` for `UnearthConfig`

### 📝 Documentation

- add Claude Code Skill definition (`.claude/skills/git-unearth/skill.md`)
  - Commands: `/why`, `/history`, `/context`, `/decisions`, `/unearth`
  - Confidence levels: 🟢 High (PR/Issue) 🟡 Medium (clear commit) 🔴 Low (AI inference)
- add examples directory with 3 demo scripts
  - `examples/basic-usage.ts` — programmatic API walkthrough
  - `examples/with-cache.ts` — cache usage patterns
  - `examples/skill-commands.ts` — skill command simulation
- add VitePress documentation site (`docs/`)
- add README.md and README_CN.md with CLI/Skill/API usage guides

### 🔧 Chores

- add initial project configuration (TypeScript 5.9, tsup, vitest, ESLint 9, Prettier)
- add CI/CD workflows — lint, typecheck, test, build, release, docs deploy
- add `bin` field to package.json for CLI entry point
