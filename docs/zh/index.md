# 🔍 Git Unearth

> AI 驱动的 git blame 增强版 — 理解**代码为什么写成这样**，而不只是"谁写的"。

## 快速链接

- [安装](/zh/guide/installation)
- [快速上手](/zh/guide/quick-start)
- [API 参考](/zh/api/)

## 它解决了什么

| 传统 git blame | Git Unearth |
|---------------|-------------------|
| `alice 2024-06-15` | 追溯 commit → PR → Issue → 业务上下文 |
| 无分组 | 分组 commits，识别决策点 |
| 无置信度 | 🟢🟡🔴 置信度级别 |

## 命令

| 命令 | 描述 |
|------|------|
| `/why <file:line>` | 为什么这样写？ |
| `/history <path>` | 演变时间线 |
| `/context <hash>` | 相关变更 |
| `/decisions` | 架构决策记录 |
