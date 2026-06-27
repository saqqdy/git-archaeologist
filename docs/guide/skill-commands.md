# Skill Commands

| Command | Description |
|---------|-------------|
| `/why <file:line>` | Why was this code written? Trace decision history |
| `/history <path>` | Evolution timeline with key decision points |
| `/context <hash>` | Related changes network |
| `/decisions [area]` | Architecture Decision Records from git history |
| `/archaeology <area>` | Deep interactive investigation |

## `/why` Example

```
/why src/utils/format.ts:32
```

Output:
```
🔍 分析 `formatDuration()` 中的 ...

📖 原因追溯：
  1. [2024-06-10] Add formatDuration helper (def456)
     → Used in multiple reporters

💡 结论：复用时间格式化逻辑 (🟡 中置信度)
```

## `/history` Example

```
/history src/collectors/git-blame.ts
```

Output:
```
📅 演变时间线 (git-blame.ts):

  2024-06-15 🔄 Fix porcelain parsing
    → abc123

  2024-06-10 🌱 Initial implementation
    → def456

🔑 关键决策：
  - Use RS/US delimiters for reliable parsing
```
