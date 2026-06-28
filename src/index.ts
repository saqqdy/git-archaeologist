/**
 * Git Unearth — git blame 增强版
 *
 * 入口模块，导出所有公开 API
 */

// Collectors
export { collectBlame, collectBlameSimple } from './collectors/git-blame'

export { cacheKey, createCacheStore, DEFAULT_CACHE_CONFIG } from './collectors/git-cache'
export { collectCommitDetail, collectDiff, collectDiffBetween } from './collectors/git-diff'
export { collectFollow } from './collectors/git-follow'
export { collectLog, getCommit } from './collectors/git-log'
// Errors
export { GitCommandError, GitParseError } from './errors'

// Types
export type {
	BlameOptions,
	CacheConfig,
	CacheStore,
	CommitDetail,
	CommitDiff,
	CommitInfo,
	DiffHunk,
	DiffOptions,
	FileBlame,
	FileDiff,
	FollowOptions,
	GitAuthor,
	LineBlame,
	LogOptions,
	LogQueryOptions,
	LogResult,
	RenameEvent,
	RenameHistory,
	UnearthConfig,
} from './types'
export { VERSION } from './types'

// Utils
export { getDefaultConfig, mergeConfig } from './utils/config'
export {
	formatCommitShort,
	formatDuration,
	formatFileDiff,
	formatLineBlame,
	formatRename,
	truncate,
} from './utils/format'
