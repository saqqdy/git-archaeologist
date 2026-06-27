# API 参考

## 函数

| 函数 | 描述 |
|------|------|
| `collectBlame()` | 行级 blame，带 commit 元数据 |
| `collectLog()` | Commit 历史，结构化解析 |
| `collectDiff()` | 特定 commit 的 diff |
| `collectDiffBetween()` | 两个 commit 之间的 diff |
| `collectFollow()` | 文件重命名追踪 |
| `collectCommitDetail()` | 完整 commit 元数据 + diff |
| `getCommit()` | 单个 commit 查询 |
| `createCacheStore()` | 创建缓存存储实例 |

## 错误类

| 类 | 描述 |
|------|------|
| `GitCommandError` | git 命令失败时抛出 |
| `GitParseError` | 解析 git 输出失败时抛出 |
