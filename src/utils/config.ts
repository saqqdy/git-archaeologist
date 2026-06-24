/**
 * Configuration management for Git Archaeologist
 */

import type { ArchaeologistConfig } from '../types'
import { DEFAULT_CACHE_CONFIG } from '../collectors/git-cache'

/** Default configuration */
const DEFAULT_CONFIG: ArchaeologistConfig = {
	maxHistoryMonths: 12,
	cache: { ...DEFAULT_CACHE_CONFIG },
	excludePaths: ['node_modules/', 'dist/', 'coverage/', 'vendor/', '.git/'],
	commitGroupWindow: '5m',
	githubTokenEnv: 'GITHUB_TOKEN',
}

/** Deep merge user config with defaults */
export function mergeConfig(user: Partial<ArchaeologistConfig>): ArchaeologistConfig {
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
export function getDefaultConfig(): ArchaeologistConfig {
	return structuredClone(DEFAULT_CONFIG)
}
