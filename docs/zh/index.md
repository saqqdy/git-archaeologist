# 🔍 Git Unearth

> AI 驱动的 git blame 增强版 — 理解**代码为什么写成这样**，而不只是"谁写的"。

[![npm version](https://img.shields.io/npm/v/git-unearth.svg)](https://www.npmjs.com/package/git-unearth)
[![license](https://img.shields.io/npm/l/git-unearth.svg)](https://github.com/saqqdy/git-unearth/blob/master/LICENSE)

## 快速链接

- [安装](/zh/guide/installation) — 几分钟快速上手
- [快速上手](/zh/guide/quick-start) — 立即体验
- [API 参考](/zh/api/) — 编程接口文档
- [技能命令](/zh/guide/skill-commands) — 交互式探索

## 问题所在

传统的 `git blame` 告诉你**谁**和**何时**，但无法解释**为什么**：

```
src/index.ts:42  alice  2024-06-15  abc123
```

它无法回答这些问题：
- 这段代码为什么存在？
- 是什么业务需求推动了它？
- 这是特意设计的还是临时方案？
- 它是如何随时间演变的？

## 解决方案

Git Unearth 通过三层追溯**决策历史**：

| 层级 | 能力 | 输出 |
|------|------|------|
| **数据收集** | 解析 git 命令为结构化数据 | `CommitInfo`、`FileBlame`、`FileDiff` |
| **语义分析** | 分组提交、分类意图 | 提交组、决策点 |
| **叙事生成** | 带证据链的解释 | 置信度：🟢 高 / 🟡 中 / 🔴 低 |

## 核心特性

### 🔍 Git 数据收集

零配置的结构化解析：

- **行级 blame** — 带提交元数据的 `collectBlame()`
- **提交历史** — 支持 RS/US 分隔符解析的 `collectLog()`
- **统一差异** — `collectDiff()` / `collectDiffBetween()`
- **重命名追踪** — 追踪文件演变的 `collectFollow()`
- **完整提交详情** — 一站式 `collectCommitDetail()`

### 💾 三级缓存

会话 → 文件系统 → 无。消除冗余 git 操作。

### 🧠 语义分析

- 按 merge/PR/时间窗口分组提交
- 意图分类：feat/fix/refactor/perf/workaround
- 构建决策时间线

### 🔄 交互式命令

在 Claude Code 中，使用自然语言探索：

| 命令 | 用途 |
|------|------|
| `/why <file:line>` | 这段代码为什么这样写？ |
| `/history <path>` | 演变时间线 |
| `/context <hash>` | 相关变更网络 |
| `/decisions` | 架构决策记录 |

## 置信度级别

| 级别 | 来源 | 含义 |
|------|------|------|
| 🟢 **高** | PR/Issue 文档 | 已验证的业务需求 |
| 🟡 **中** | 清晰的提交信息 | 提交中明确的意图 |
| 🔴 **低** | 仅 AI 推断 | 基于模式的推理 |

## 示例输出

```
/why src/utils/format.ts:32

🔍 分析 formatDuration()...

📖 原因追溯：
  1. [2024-06-10] 添加 formatDuration 辅助函数 (def456)
     → 各报告器共享的时间格式化
  2. [2024-06-05] PR #42 → Issue #18
     → 用户报告时间显示不友好

💡 结论：用于一致时间显示的工具函数 (🟢 高置信度)

💭 进一步探索：
   - /history src/utils/format.ts
   - /context def456
```

## 对比

| 维度 | git blame | Git Unearth |
|------|-----------|-------------|
| 输出 | `author date code` | 结构化 `CommitInfo` + 证据链 |
| **为什么？** | ❌ 无 | ✅ 追溯 PR/Issue/业务上下文 |
| **分组** | ❌ 无 | ✅ 提交组、决策点 |
| **置信度** | ❌ 无 | ✅ 🟢🟡🔴 级别 |
| **缓存** | ❌ 无 | ✅ 三级缓存 |
| **API** | ❌ 无 | ✅ TypeScript/Node.js API |

## 快速开始

选择适合你的方式：

### 1. Claude Code 插件（推荐）

```bash
# 插件市场
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

### 2. NPM 包

```bash
pnpm add git-unearth
```

### 3. CLI（零安装）

```bash
npx git-unearth blame src/index.ts
npx git-unearth log --max-count 5
```

### 4. 克隆与探索

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install
npx tsx examples/basic-usage.ts
```

## 项目状态

| 版本 | 主题 | 状态 |
|------|------|------|
| v0.1.1 | 数据收集层 | ✅ 已发布 |
| v0.2.0 | 分析引擎 | 📋 计划中 |
| v0.3.0 | 决策时间线 + ADR | 📋 计划中 |
| v1.0.0 | 生产就绪 | 📋 计划中 |

详见[路线图](/zh/guide/roadmap)。

## 许可证

MIT — 个人和商业项目均可自由使用。
