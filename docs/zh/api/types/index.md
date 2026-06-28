# 类型定义

Git Unearth API 的核心 TypeScript 类型。

## 核心类型

| 类型 | 描述 | 文件 |
|------|------|------|
| [`CommitInfo`](/zh/api/types/commit-info) | 提交元数据，包含作者、消息、哈希 | commit-info.md |
| [`FileBlame`](/zh/api/types/file-blame) | 行级别 blame 结果，包含提交信息 | file-blame.md |
| [`FileDiff`](/zh/api/types/file-diff) | 统一差异，包含 hunks 和文件变更 | file-diff.md |
| [`RenameHistory`](/zh/api/types/rename-history) | 文件重命名跟踪结果 | rename-history.md |

## 使用方法

```typescript
import type {
  CommitInfo,
  FileBlame,
  FileDiff,
  RenameHistory,
} from 'git-unearth'
```

## 类型安全

所有类型都使用 TypeScript 5.9+ 严格模式完整类型化：

- ✅ 无 `any` 类型
- ✅ 完整的 null 检查
- ✅ 显式返回类型
- ✅ 完整的 JSDoc 文档

## 设计原则

1. **结构化输出** — 所有 git 命令输出都解析为类型化对象
2. **不可变数据** — 所有类型在适用处都是只读的
3. **显式可空** — 可选字段明确标记为 `?`
4. **可序列化** — 所有类型都可以序列化为 JSON

## 相关内容

- [API 函数](/zh/api/) — 使用这些类型的函数签名
- [缓存指南](/zh/guide/caching) — 缓存相关类型
