# 安装

选择适合你工作流程的安装方式。

## 方式 1：Claude Code 插件（推荐）

Git Unearth 设计为 **Claude Code 插件**，可无缝集成。

### 方法 A：插件市场

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

### 方法 B：本地安装

```bash
# 1. 进入你的项目
cd your-project

# 2. 安装 npm 包
pnpm add -D git-unearth

# 3. 复制 skill 文件
mkdir -p .claude/skills
cp -r node_modules/git-unearth/.claude/skills/git-unearth .claude/skills/
```

安装完成后，在 Claude Code 中使用 `/why`、`/history`、`/context` 等命令。

## 方式 2：NPM 包

用于 Node.js/TypeScript 项目中的编程使用：

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

// 行级 blame
const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 1,
  endLine: 10,
  cache,
})

// 提交历史
const log = await collectLog({
  root: process.cwd(),
  log: { maxCount: 20 },
  cache,
})
```

## 方式 3：CLI（零安装）

使用 `npx` 直接运行，无需安装：

```bash
# 在任何 git 仓库中
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
npx git-unearth diff abc1234
npx git-unearth follow src/index.ts
npx git-unearth detail abc1234
npx git-unearth help
```

## 方式 4：克隆并探索

用于开发或探索示例：

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install

# 运行示例
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

## 验证

验证你的安装：

```bash
# CLI
npx git-unearth --version

# Node.js
node -e "console.log(require('git-unearth').version)"
```

## 下一步

- [快速开始](/guide/quick-start) — 查看 Git Unearth 实战演示
- [API 参考](/api/) — 探索完整 API
- [Skill 命令](/guide/skill-commands) — 交互式 unearth 命令