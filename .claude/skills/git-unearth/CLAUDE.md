# Git Unearth — Claude Code Guide

## Project Overview

Git Unearth 是一个 Claude Code Skill 插件，将 `git blame` 从"谁写的"升级为"为什么这样写"——通过 AI 语义分析追溯代码决策历史。

## Architecture

```
.claude/skills/git-unearth/  ← Skill 定义（核心产品）
src/                               ← TypeScript 源码（程序化 API）
internal/                          ← 内部规划文档
```

## Development Commands

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint 检查 + 自动修复
pnpm run typecheck    # TypeScript 类型检查
pnpm run test         # 运行测试 (vitest)
pnpm run build        # 构建 (ESM + CJS)
pnpm run dev          # 监听模式开发
```

## Key Principles

1. **语义级考古** — 理解代码意图和决策背景，不是简单的 git blame 输出
2. **证据链可溯** — 每个结论必须有 commit → PR → Issue 的证据支撑
3. **置信度标注** — 🟢高(有PR/Issue) 🟡中(commit清晰) 🔴低(AI推断)
4. **渐进式** — 支持从概览到详情的多层追问

## Code Style

- TypeScript 5.9+，strict mode
- 文件命名：kebab-case
- 导出：named exports，不用 default
- 注释密度：关键模块加 JSDoc，公共 API 必须有
- 测试：vitest，放在同级 `*.test.ts`

## Version Plan

- v0.1.0 Daybreak: 数据采集层 (blame/log/diff/follow + cache)
- v0.2.0 Sunrise: 分析引擎 (commit 分组 + 意图分类 + 热点)
- 完整路线图见 `internal/development-plan.md`
