/**
 * Git Archaeologist — Core type definitions
 */

// ─── Git Primitives ──────────────────────────────────────────────

/** Author identity from git */
export interface GitAuthor {
	name: string
	email: string
}

/** Parsed commit metadata (no diff content) */
export interface CommitInfo {
	hash: string
	abbrevHash: string
	author: GitAuthor
	committer: GitAuthor
	authorDate: string /** ISO 8601 */
	committerDate: string /** ISO 8601 */
	message: string
	parents: string[]
}

// ─── Blame ───────────────────────────────────────────────────────

/** Single line blame result */
export interface LineBlame {
	/** File path (relative to repo root) */
	file: string
	/** 1-based line number */
	line: number
	/** Commit that last touched this line */
	commit: CommitInfo
	/** The actual line content */
	content: string
}

/** Full file blame result */
export interface FileBlame {
	file: string
	lines: LineBlame[]
	/** Blame duration in ms */
	duration: number
}

// ─── Diff ────────────────────────────────────────────────────────

/** A single hunk within a file diff */
export interface DiffHunk {
	/** Header line, e.g. "@@ -10,4 +12,6 @@" */
	header: string
	oldStart: number
	oldCount: number
	newStart: number
	newCount: number
	/** Lines with prefix: ' ' (context), '+' (add), '-' (delete) */
	lines: string[]
}

/** Diff for a single file */
export interface FileDiff {
	/** File path (relative) */
	file: string
	/** Renamed from (if applicable) */
	from?: string
	/** Added, deleted, modified, or renamed */
	status: 'added' | 'deleted' | 'modified' | 'renamed'
	additions: number
	deletions: number
	hunks: DiffHunk[]
}

/** Full commit diff result */
export interface CommitDiff {
	hash: string
	files: FileDiff[]
	/** Total additions across all files */
	totalAdditions: number
	/** Total deletions across all files */
	totalDeletions: number
	duration: number
}

// ─── Log ─────────────────────────────────────────────────────────

/** Options for filtering git log */
export interface LogOptions {
	/** Maximum number of commits to return (0 = unlimited) */
	maxCount?: number
	/** Only commits after this date (ISO 8601 or git date format) */
	since?: string
	/** Only commits before this date */
	until?: string
	/** Only commits by this author (name or email pattern) */
	author?: string
	/** Only commits touching these paths */
	paths?: string[]
	/** Include merge commits (default: true) */
	merges?: boolean
	/** Follow file renames (only valid when paths has exactly one entry) */
	follow?: boolean
}

/** Result of a git log query */
export interface LogResult {
	commits: CommitInfo[]
	/** Whether results were truncated by maxCount */
	truncated: boolean
	duration: number
}

// ─── Rename Tracking ─────────────────────────────────────────────

/** A single rename event in a file's history */
export interface RenameEvent {
	/** Commit that performed the rename */
	commit: CommitInfo
	/** File path before rename */
	from: string
	/** File path after rename */
	to: string
	/** Similarity percentage (git's -M detection) */
	similarity: number
}

/** Full rename history for a file */
export interface RenameHistory {
	/** Current file path */
	currentPath: string
	/** Original file path (earliest known) */
	originalPath: string
	/** Rename events in reverse chronological order */
	renames: RenameEvent[]
	duration: number
}

// ─── Commit Detail ───────────────────────────────────────────────

/** Full commit content including diff */
export interface CommitDetail {
	commit: CommitInfo
	diff: CommitDiff
	duration: number
}

// ─── Cache ───────────────────────────────────────────────────────

/** Cache storage backend */
export interface CacheStore {
	get: <T>(key: string) => T | undefined
	set: <T>(key: string, value: T, ttl?: number) => void
	has: (key: string) => boolean
	delete: (key: string) => boolean
	clear: () => void
}

/** Cache configuration */
export interface CacheConfig {
	/** Enable in-memory session cache (default: true) */
	sessionCache: boolean
	/** Enable filesystem cache (default: true) */
	fsCache: boolean
	/** Filesystem cache directory (default: '.git-archaeologist') */
	cacheDir: string
	/** Default TTL in seconds (default: 86400 = 24h) */
	defaultTTL: number
}

// ─── Configuration ───────────────────────────────────────────────

/** Archaeologist configuration */
export interface ArchaeologistConfig {
	/** Maximum months of history to analyze (default: 12, 0 = unlimited) */
	maxHistoryMonths: number
	/** Cache configuration */
	cache: CacheConfig
	/** Paths to exclude from analysis */
	excludePaths: string[]
	/** Commit grouping time window (default: '5m') */
	commitGroupWindow: string
	/** GitHub token env var name (default: 'GITHUB_TOKEN') */
	githubTokenEnv: string
}

/** Options for the core API functions */
export interface BlameOptions {
	/** Repository root path */
	root: string
	/** File path (relative to root) */
	file: string
	/** Start line (1-based, optional) */
	startLine?: number
	/** End line (1-based, inclusive, optional) */
	endLine?: number
	/** Optional cache store to avoid redundant git commands */
	cache?: CacheStore
}

export interface LogQueryOptions {
	/** Repository root path */
	root: string
	/** Log filtering options */
	log?: LogOptions
	/** Optional cache store */
	cache?: CacheStore
}

export interface DiffOptions {
	/** Repository root path */
	root: string
	/** Commit hash */
	hash: string
	/** Optional cache store */
	cache?: CacheStore
}

export interface FollowOptions {
	/** Repository root path */
	root: string
	/** File path to track */
	file: string
	/** Optional cache store */
	cache?: CacheStore
}

/** Version constant */
export const VERSION = '0.1.0' as const
