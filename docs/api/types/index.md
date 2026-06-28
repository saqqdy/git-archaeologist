# Type Definitions

Core TypeScript types for Git Unearth API.

## Core Types

| Type | Description | File |
|------|-------------|------|
| [`CommitInfo`](/api/types/commit-info) | Commit metadata with author, message, hash | commit-info.md |
| [`FileBlame`](/api/types/file-blame) | Line-level blame result with commit info | file-blame.md |
| [`FileDiff`](/api/types/file-diff) | Unified diff with hunks and file changes | file-diff.md |
| [`RenameHistory`](/api/types/rename-history) | File rename tracking result | rename-history.md |

## Usage

```typescript
import type {
  CommitInfo,
  FileBlame,
  FileDiff,
  RenameHistory,
} from 'git-unearth'
```

## Type Safety

All types are fully typed with TypeScript 5.9+ strict mode:

- ✅ No `any` types
- ✅ Exhaustive null checks
- ✅ Explicit return types
- ✅ Complete JSDoc documentation

## Design Principles

1. **Structured Output** — All git command outputs are parsed into typed objects
2. **Immutable Data** — All types are readonly where applicable
3. **Nullable Explicit** — Optional fields explicitly marked with `?`
4. **Serializable** — All types can be serialized to JSON

## Related

- [API Functions](/api/) — Function signatures using these types
- [Caching Guide](/guide/caching) — Cache-related types
