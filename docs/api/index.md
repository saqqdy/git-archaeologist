# API Reference

## Functions

| Function | Description |
|----------|-------------|
| `collectBlame()` | Line-level blame with commit metadata |
| `collectLog()` | Commit history with structured parsing |
| `collectDiff()` | Diff for a specific commit |
| `collectDiffBetween()` | Diff between two commits |
| `collectFollow()` | File rename tracking |
| `collectCommitDetail()` | Full commit metadata + diff |
| `getCommit()` | Single commit lookup |
| `createCacheStore()` | Create a cache store instance |

## Error Classes

| Class | Description |
|-------|-------------|
| `GitCommandError` | Thrown when a git command fails |
| `GitParseError` | Thrown when parsing git output fails |
