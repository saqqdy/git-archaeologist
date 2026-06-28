# Installation

Choose the installation method that fits your workflow.

## Option 1: Claude Code Plugin (Recommended)

Git Unearth is designed as a **Claude Code Plugin** for seamless integration.

### Method A: Plugin Marketplace

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

### Method B: Local Install

```bash
# 1. Navigate to your project
cd your-project

# 2. Install npm package
pnpm add -D git-unearth

# 3. Copy skill files
mkdir -p .claude/skills
cp -r node_modules/git-unearth/.claude/skills/git-unearth .claude/skills/
```

After installation, use commands like `/why`, `/history`, `/context` in Claude Code.

## Option 2: NPM Package

For programmatic usage in Node.js/TypeScript projects:

```bash
pnpm add git-unearth
```

```typescript
import {
  collectBlame,
  collectLog,
  collectCommitDetail,
  createCacheStore,
} from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

// Line-level blame
const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 1,
  endLine: 10,
  cache,
})

// Commit history
const log = await collectLog({
  root: process.cwd(),
  log: { maxCount: 20 },
  cache,
})
```

## Option 3: CLI (Zero-Install)

Run directly with `npx` — no installation required:

```bash
# In any git repository
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
npx git-unearth diff abc1234
npx git-unearth follow src/index.ts
npx git-unearth detail abc1234
npx git-unearth help
```

## Option 4: Clone and Explore

For development or exploring examples:

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

## Verification

Verify your installation:

```bash
# CLI
npx git-unearth --version

# Node.js
node -e "console.log(require('git-unearth').version)"
```

## Next Steps

- [Quick Start](/guide/quick-start) — See Git Unearth in action
- [API Reference](/api/) — Explore the full API
- [Skill Commands](/guide/skill-commands) — Interactive unearth commands
