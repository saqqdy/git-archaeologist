# API 参考

完整的 git-unearth TypeScript/Node.js API。

## 核心函数

### 数据收集

| 函数 | 描述 | 返回值 |
|------|------|--------|
| [`collectBlame()`](/api/collect-blame) | 行级 blame，带 commit 元数据 | `FileBlame` |
| [`collectLog()`](/api/collect-log) | Commit 历史，结构化解析 | `CommitInfo[]` |
| [`collectDiff()`](/api/collect-diff) | 特定 commit 的 diff | `FileDiff` |
| [`collectDiffBetween()`](/api/collect-diff) | 两个 commit 之间的 diff | `FileDiff[]` |
| [`collectFollow()`](/api/collect-follow) | 文件重命名追踪 | `RenameHistory` |
| [`collectCommitDetail()`](/api/collect-commit-detail) | 完整 commit 元数据 + diff | `CommitDetail` |
| [`getCommit()`](/api/collect-commit-detail) | 单个 commit 查询 | `CommitInfo` |

### 缓存管理

| 函数 | 描述 | 返回值 |
|------|------|--------|
| [`createCacheStore()`](/api/create-cache-store) | 创建缓存存储实例 | `CacheStore` |

## 错误处理

| 类 | 描述 | 属性 |
|------|------|------|
| `GitCommandError` | Git 命令执行失败 | `command`、`exitCode`、`stderr` |
| `GitParseError` | 解析 git 输出失败 | `output`、`parseError` |

## 常用模式

### 基础 Blame

```typescript
import { collectBlame, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 1,
  endLine: 10,
  cache,
})

for (const line of blame.lines) {
  console.log(`${line.line}: ${line.commit.message} (${line.commit.author.name})`)
}
```

### Commit 历史

```typescript
import { collectLog, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const log = await collectLog({
  root: process.cwd(),
  log: {
    maxCount: 20,
    paths: ['src/'],
  },
  cache,
})

console.log(`找到 ${log.commits.length} 个提交`)
```

### 完整 Commit 详情

```typescript
import { collectCommitDetail, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const detail = await collectCommitDetail({
  root: process.cwd(),
  hash: 'abc1234',
  cache,
})

console.log(`${detail.commit.message}`)
console.log(`+${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
```

### 文件演变

```typescript
import { collectFollow, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

const history = await collectFollow({
  root: process.cwd(),
  file: 'src/index.ts',
  cache,
})

console.log(`文件有 ${history.renames.length} 次重命名`)
for (const rename of history.renames) {
  console.log(`${rename.oldPath} → ${rename.newPath}`)
}
```

### Diff 分析

```typescript
import { collectDiff, collectDiffBetween, createCacheStore } from 'git-unearth'

const cache = createCacheStore({ sessionCache: true })

// 单个 commit diff
const diff1 = await collectDiff({
  root: process.cwd(),
  hash: 'abc1234',
  cache,
})

// 两个 commit 之间的 diff
const diff2 = await collectDiffBetween({
  root: process.cwd(),
  fromHash: 'abc1234',
  toHash: 'def5678',
  cache,
})
```

## 类型安全

所有 API 都提供完整的 TypeScript 类型：

```typescript
import type {
  FileBlame,
  CommitInfo,
  FileDiff,
  RenameHistory,
  CommitDetail,
  CacheStore,
  CacheOptions,
} from 'git-unearth'
```

详见[类型定义](/api/types/)。

## 性能

### 缓存策略

三级缓存层次：

1. **会话缓存** — 内存 Map，最快但不持久
2. **文件系统缓存** — 持久化到 `.git-unearth/`，重启后保留
3. **无缓存** — 实时 git 调用，始终准确但较慢

建议：同时启用会话和文件系统缓存以获得最佳性能。

### 基准测试

| 操作 | 无缓存 | 会话缓存 | 提升 |
|------|--------|----------|------|
| `collectBlame()` (100 行) | ~150ms | ~15ms | 10 倍 |
| `collectLog()` (100 commits) | ~200ms | ~20ms | 10 倍 |
| `collectCommitDetail()` | ~300ms | ~30ms | 10 倍 |

## 错误处理

```typescript
import { GitCommandError, GitParseError } from 'git-unearth'

try {
  const blame = await collectBlame({ root, file, cache })
} catch (error) {
  if (error instanceof GitCommandError) {
    console.error(`Git 命令失败: ${error.command}`)
    console.error(`退出码: ${error.exitCode}`)
    console.error(`stderr: ${error.stderr}`)
  } else if (error instanceof GitParseError) {
    console.error(`解析错误: ${error.parseError}`)
    console.error(`输出: ${error.output}`)
  }
}
```

## 配置

### 缓存选项

```typescript
interface CacheOptions {
  sessionCache?: boolean    // 启用内存缓存 (默认: false)
  fsCache?: boolean         // 启用文件系统缓存 (默认: false)
  cacheDir?: string         // 缓存目录 (默认: '.git-unearth')
  defaultTTL?: number       // 默认 TTL 秒数 (默认: 3600)
}
```

### 收集器选项

所有收集器共享通用选项：

```typescript
interface CollectorOptions {
  root: string              // Git 仓库根目录
  cache?: CacheStore        // 缓存存储实例
}
```

## CLI 参考

```bash
# Blame
npx git-unearth blame <文件> [--start-line N] [--end-line N]

# Log
npx git-unearth log [--max-count N] [--paths 路径1,路径2]

# Diff
npx git-unearth diff <hash>

# Follow
npx git-unearth follow <文件>

# Commit 详情
npx git-unearth detail <hash>

# 帮助
npx git-unearth help
```

## 集成示例

### 与测试框架集成

```typescript
import { collectBlame } from 'git-unearth'
import { describe, it, expect } from 'vitest'

describe('Git 历史', () => {
  it('应该有有效的 commit 元数据', async () => {
    const blame = await collectBlame({
      root: process.cwd(),
      file: 'src/index.ts',
      startLine: 1,
      endLine: 10,
    })
    
    for (const line of blame.lines) {
      expect(line.commit.hash).toMatch(/^[a-f0-9]{7,40}$/)
      expect(line.commit.author.name).toBeTruthy()
      expect(line.commit.author.email).toBeTruthy()
    }
  })
})
```

### 与 CI/CD 集成

```yaml
# GitHub Actions 示例
name: 代码挖掘
on: [pull_request]

jobs:
  unearth:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx git-unearth blame src/index.ts
      - run: npx git-unearth log --max-count 20
```

## 下一步

- 浏览各个函数的文档
- 查看详细接口的类型定义
- 查看[缓存指南](/guide/caching)了解缓存策略
