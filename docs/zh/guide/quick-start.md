# 快速上手

## 使用 Skill 命令

在 Claude Code 中运行：

```
/why src/index.ts:42
```

输出：

```
🔍 分析 src/index.ts:42...

📖 原因追溯：
  1. [2024-06-15] Add error handling (abc123)
     → 防止无效输入时崩溃
  2. [2024-05-20] PR #42 → Issue #18
     → 用户报告边界情况崩溃

💡 结论：错误处理是为了防止边界情况崩溃 (🟢 高置信度)

💭 后续操作：
   - /history src/utils/format.ts
   - /context abc123
```

## 使用 API

```typescript
import { collectBlame, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 42,
  endLine: 50,
  cache,
})

console.log(`Lines: ${blame.lines.length}`)
console.log(`Duration: ${blame.duration}ms`)
```

## 使用 CLI

```bash
# 行级 blame
npx git-unearth blame src/index.ts --start-line 1 --end-line 10

# 提交历史
npx git-unearth log --max-count 20 --paths src/

# 文件重命名追踪
npx git-unearth follow src/index.ts

# 完整提交详情
npx git-unearth detail abc1234
```