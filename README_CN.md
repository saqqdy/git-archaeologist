# 🔍 Git Unearth

> AI 驱动的 git blame 增强版 — 理解"**代码为什么写成这样**"，而不只是"谁写的"。语义级代码考古，通过 Claude Code Skill 实现。

[![npm version](https://img.shields.io/npm/v/git-unearth.svg)](https://www.npmjs.com/package/git-unearth)
[![license](https://img.shields.io/npm/l/git-unearth.svg)](https://github.com/saqqdy/git-unearth/blob/master/LICENSE)

[English Docs](README.md)

---

## 🎯 解决的问题

| 场景 | 传统 git blame | Git Unearth |
|------|---------------|-------------------|
| "这行为什么这样写？" | `alice 2024-06-15` — 只告诉你谁写的 | 追溯 commit → PR → Issue → 业务上下文 |
| "为什么用这个模式？" | 无洞察 | 分组相关 commits，识别决策点 |
| "这是故意的吗？" | 不清楚 | 置信度：🟢 高（有文档）🟡 中（commit 清晰）🔴 低（AI 推断） |

**核心洞察**：代码考古需要理解**决策历史**，而不只是作者历史。

---

## ✨ 核心功能

### 🔍 Git 数据采集层 (v0.1.0)

结构化解析 git 命令输出：

- **`collectBlame()`** — 行级 blame，带 commit 元数据
- **`collectLog()`** — Commit 历史，RS/US 分隔符解析
- **`collectDiff()`** / **`collectDiffBetween()`** — 统一 diff，带 hunks
- **`collectFollow()`** — 文件重命名追踪
- **`collectCommitDetail()`** — 完整 commit + diff，一次调用

### 💾 三层缓存

Session (Map) → Filesystem → None。避免重复 git 操作。

### 🧠 语义分析 (v0.2.0+)

- Commit 分组（merge/PR/时间窗口）
- 意图分类（feat/fix/refactor/perf/workaround）
- 决策时间线构建

### 🔄 交互式考古命令

| 命令 | 描述 |
|------|------|
| `/why <file:line>` | 为什么这样写？追溯决策历史 |
| `/history <path>` | 演变时间线，标注关键决策点 |
| `/context <hash>` | 相关变更网络 |
| `/decisions [area]` | 从 git 历史提取架构决策记录 |
| `/archaeology <area>` | 深度交互式调查 |

---

## 🚀 快速开始

### 方式 1：Claude Code Skill（推荐）

本项目是一个 **Claude Code Plugin**，可通过插件市场一键安装。

#### 安装方式 A：插件市场（推荐）

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

#### 安装方式 B：本地安装

```bash
# 1. 进入项目目录
cd your-project

# 2. 安装 npm 包
pnpm add -D git-unearth

# 3. 复制插件文件
mkdir -p .claude/skills
cp -r node_modules/git-unearth/.claude/skills/git-unearth .claude/skills/
```

#### 可用命令

在 Claude Code 中输入以下命令：

| 命令 | 描述 | 示例 |
|------|------|------|
| `/why` | 为什么这样写？追溯决策历史 | `/why src/index.ts:42` |
| `/history` | 演变时间线，标注关键决策点 | `/history src/components/` |
| `/context` | 相关变更网络 | `/context HEAD` |
| `/decisions` | 从 git 历史提取架构决策记录 | `/decisions` |
| `/archaeology` | 深度交互式调查 | `/archaeology src/` |

#### 输出示例

```
/why src/utils/format.ts:32

🔍 分析 `formatDuration()` 中的 ...

📖 原因追溯：
  1. [2024-06-10] Add formatDuration helper (def456)
     → 用于多个 reporter 的时间格式化
  2. [2024-06-05] PR #42 → Issue #18
     → 用户报告时间显示不友好

💡 结论：为了统一时间显示格式而添加的工具函数 (🟢 高置信度)

💭 可追问：
   - /history src/utils/format.ts
   - /context def456
```

### 方式 2：程序化调用

```bash
pnpm add git-unearth
```

```typescript
import {
  collectBlame, collectLog, collectCommitDetail, collectFollow,
  createCacheStore,
} from 'git-unearth'

const cache = createCacheStore({ sessionCache: true, fsCache: true })

// 获取行级 blame
const blame = await collectBlame({
  root: process.cwd(), file: 'src/index.ts', startLine: 1, endLine: 10, cache,
})

for (const line of blame.lines) {
  console.log(`${line.line}: ${line.commit.message} (${line.commit.author.name})`)
}

// 获取 commit 历史
const log = await collectLog({
  root: process.cwd(), log: { maxCount: 20, paths: ['src/'] }, cache,
})

// 完整 commit 详情
const detail = await collectCommitDetail({
  root: process.cwd(), hash: log.commits[0].hash, cache,
})

console.log(`${detail.commit.message}`)
console.log(`+${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
```

### 方式 3：CLI（零安装）

```bash
# 在任何 git 仓库中，一条命令即可体验：
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
npx git-unearth diff abc1234
npx git-unearth follow src/index.ts
npx git-unearth detail abc1234
npx git-unearth help
```

### 方式 4：Clone 并运行示例

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install

# 运行示例
npx tsx examples/basic-usage.ts
npx tsx examples/with-cache.ts
npx tsx examples/skill-commands.ts
```

---

## 📋 版本路线图

| 版本 | 代号 | 主题 | 状态 |
|------|------|------|------|
| v0.1.0 | Daybreak | 数据采集层 (blame/log/diff/follow + cache) | ✅ 当前 |
| v0.2.0 | Sunrise | 分析引擎 (commit 分组 + 意图分类) | 📋 计划中 |
| v0.3.0 | Dawn | 决策时间线 + ADR 生成 | 📋 计划中 |
| v0.4.0 | Ember | 交互式考古向导 | 📋 计划中 |
| v1.0.0 | Lighthouse | 生产就绪 + marketplace | 📋 计划中 |

---

## 🗂️ 项目结构

```
git-unearth/
├── .claude/skills/git-unearth/   # Skill 提示词（核心产品）
│   └── skill.md                        # 命令 + 执行流程
├── src/                                # TypeScript 源码
│   ├── index.ts                        # 公开 API 导出
│   ├── types.ts                        # 核心类型
│   ├── errors.ts                       # GitCommandError, GitParseError
│   ├── collectors/                     # Git 数据采集器
│   │   ├── git-blame.ts                # 行级 blame
│   │   ├── git-log.ts                  # Commit 历史
│   │   ├── git-diff.ts                 # 统一 diff
│   │   ├── git-follow.ts               # 重命名追踪
│   │   └── git-cache.ts                # 三层缓存
│   └── utils/                          # 工具函数
│       ├── config.ts                   # 配置管理
│       └── format.ts                   # 输出格式化
├── examples/                           # 使用示例
├── docs/                               # VitePress 文档
└── internal/                           # 规划文档
```

---

## 🛠️ 开发

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint + 自动修复
pnpm run typecheck    # TypeScript 检查
pnpm run test         # 运行测试 (vitest)
pnpm run build        # 构建 (ESM + CJS)
pnpm run docs:dev     # 启动文档服务器
```

---

## 🆚 对比

### vs git blame

| 维度 | git blame | Git Unearth |
|------|-----------|-------------------|
| 输出 | `author date code` | 结构化 `CommitInfo` + 证据链 |
| 为什么？ | ❌ 无 | ✅ 追溯 PR/Issue/业务上下文 |
| 分组 | ❌ 无 | ✅ Commit 分组，决策点 |
| 置信度 | ❌ 无 | ✅ 🟢🟡🔴 级别 |
| 缓存 | ❌ 无 | ✅ 三层缓存 |

---

## 📄 许可证

[MIT](./LICENSE)
