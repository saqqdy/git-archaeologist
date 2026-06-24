/**
 * Git Archaeologist — git blame 增强版
 *
 * 入口模块，导出所有公开 API
 */

// Errors
export { GitCommandError, GitParseError } from './errors'

// Collectors
export { collectBlame, collectBlameSimple } from './collectors/git-blame'
export { collectLog, getCommit } from './collectors/git-log'
export { collectDiff, collectDiffBetween, collectCommitDetail } from './collectors/git-diff'
export { collectFollow } from './collectors/git-follow'
export { createCacheStore, cacheKey, DEFAULT_CACHE_CONFIG } from './collectors/git-cache'

// Types
export type {
	ArchaeologistConfig,
	BlameOptions,
	CacheConfig,
	CacheStore,
	CommitDiff,
	CommitDetail,
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
