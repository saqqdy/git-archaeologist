# Skill 命令

| 命令 | 描述 |
|------|------|
| `/why <file:line>` | 为什么这样写？追溯决策历史 |
| `/history <path>` | 演变时间线，标注关键决策点 |
| `/context <hash>` | 相关变更网络 |
| `/decisions [area]` | 从 git 历史提取架构决策记录 |
| `/unearth <area>` | 深度交互式调查 |

## `/why` 示例

```
/why src/utils/format.ts:32
```

输出：
```
🔍 分析 `formatDuration()` 中的 ...

📖 原因追溯：
  1. [2024-06-10] Add formatDuration helper (def456)
     → 用于多个 reporter 的时间格式化

💡 结论：复用时间格式化逻辑 (🟡 中置信度)
```

## `/history` 示例

```
/history src/collectors/git-blame.ts
```

输出：
```
📅 演变时间线 (git-blame.ts):

  2024-06-15 🔄 Fix porcelain parsing
    → abc123

  2024-06-10 🌱 Initial implementation
    → def456

🔑 关键决策：
  - 使用 RS/US 分隔符确保可靠解析
```
