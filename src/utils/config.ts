/**
 * Configuration management for Git Unearth
 */

import type { UnearthConfig } from '../types'
import { DEFAULT_CACHE_CONFIG } from '../collectors/git-cache'

/** Default configuration */
const DEFAULT_CONFIG: UnearthConfig = {
	maxHistoryMonths: 12,
	cache: { ...DEFAULT_CACHE_CONFIG },
	excludePaths: ['node_modules/', 'dist/', 'coverage/', 'vendor/', '.git/'],
	commitGroupWindow: '5m',
	githubTokenEnv: 'GITHUB_TOKEN',
}

/** Deep merge user config with defaults */
export function mergeConfig(user: Partial<UnearthConfig>): UnearthConfig {
	return {
		...DEFAULT_CONFIG,
		...user,
		cache: {
			...DEFAULT_CONFIG.cache,
			...user.cache,
		},
		excludePaths: user.excludePaths ?? DEFAULT_CONFIG.excludePaths,
	}
}

/** Get default configuration (fresh copy) */
export function getDefaultConfig(): UnearthConfig {
	return structuredClone(DEFAULT_CONFIG)
}
