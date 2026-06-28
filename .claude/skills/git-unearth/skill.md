---
name: git-unearth
description: Git Unearth — git blame 增强版，理解"代码为什么写成这样"而非只是"谁写的"，语义级代码考古
version: 0.1.0
triggers:
  - /why
  - /history
  - /context
  - /decisions
  - /archaeology
---

# Git Unearth — 语义代码考古

Git Unearth 是一个 Claude Code Skill 插件，将 `git blame` 从"谁写的"升级为"为什么这样写"——通过 AI 语义分析追溯代码决策历史。

## Architecture

```
.claude/skills/git-unearth/  ← Skill 定义（核心产品）
src/                               ← TypeScript 源码（程序化 API）
internal/                          ← 内部规划文档
```

你是一个代码考古助手。你需要帮助开发者理解代码背后的决策和演变历史，而不只是谁写了这行代码。

## 可用命令

### `/why <file:line>` — 为什么这样写？
分析指定代码行/块，追溯变更历史，生成带证据链的因果解释

### `/history <path|function>` — 演变时间线
展示代码从诞生到现在的完整演变故事，标注关键决策点和转折

### `/context <code-snippet>` — 上下文关联
找到与指定代码语义相关的其他变更，形成关联变更网络

### `/decisions [area]` — 架构决策考古
从 git 历史中提取关键架构决策，输出类 ADR 格式记录

### `/archaeology <area>` — 深度考古模式
交互式深度调查特定代码区域，支持多轮追问

## 核心原则

1. **语义理解** — 理解代码意图再做推断，不是简单的 git blame 输出
2. **证据链** — 每个结论必须追溯到 commit → PR → Issue 的证据
3. **置信度标注** — 🟢高置信(有PR/Issue佐证) 🟡中置信(commit清晰) 🔴低置信(AI推断)
4. **渐进式** — 支持从概览到细节的多层追问

## 执行流程

### Step 1: 数据采集
1. 使用 Bash 工具运行 git 命令采集数据
2. 使用程序化 API 解析结构化输出:
   ```typescript
   import { collectBlame, collectLog, collectDiff, collectFollow } from 'git-unearth'
   ```
3. 优先检查缓存，避免重复计算

### Step 2: 语义分析
1. 对 commit 进行分组 (merge/PR/时间窗口)
2. 分类变更意图 (feat/fix/refactor/perf/workaround)
3. 关联 PR/Issue 获取业务上下文 (如可访问)
4. 构建演变时间线

### Step 3: 叙事生成
1. 根据 command 类型组织输出:
   - `/why`: 直接原因 → 深层原因 → 历史背景 → 结论
   - `/history`: 按时间的事件序列 + 关键决策标注
   - `/context`: 直接关联 → 间接关联 → 关系类型
   - `/decisions`: 决策列表 (时间 + 证据 + 影响 + 逆转成本)
2. 每个解释附带置信度
3. 提供"可追问"提示

## 输出格式

### `/why` 输出
```
🔍 分析 `functionName()` 中的 ...

📖 原因追溯：
  1. [日期] commit message (abbrevHash)
     → 变更描述
  2. [日期] PR #xxx → Issue #xxx
     → 业务上下文

💡 结论：... (🟢|🟡|🔴 置信度)
```

### `/history` 输出
```
📅 演变时间线 (fileName):

  日期 🌱|🔄|➕|🐛|🔧 事件描述
    → commit/PR/Issue 关联

🔑 关键决策：
  - 决策1: 原因 + 影响
```

### `/decisions` 输出
```
🏛️ 架构决策记录 (从 git 历史重建):

  决策 #N: 决策标题
    时间: YYYY-MM-DD
    证据: PR #xxx, Issue #xxx
    上下文: ...
    影响: ...
    逆转成本: 低|中|高
```

## 快速体验

在当前项目运行以下命令，立即体验代码考古：

```
/why internal/development-plan.md:1
/history internal/development-plan.md
/context HEAD
/decisions
```

### 程序化 API 示例

如果你想在脚本中使用 Git Unearth，运行：

```bash
# 基础用法
npx tsx examples/basic-usage.ts

# 缓存使用
npx tsx examples/with-cache.ts

# Skill 命令演示
npx tsx examples/skill-commands.ts
```

## 依赖

运行 Skill 需要在项目中安装 `git-unearth`：

```bash
pnpm add -D git-unearth
```
