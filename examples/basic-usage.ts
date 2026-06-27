/**
 * Basic usage examples for Git Archaeologist
 *
 * Run with: npx tsx examples/basic-usage.ts
 */

import {
	collectBlame,
	collectLog,
	collectDiff,
	collectFollow,
	collectCommitDetail,
	formatCommitShort,
	formatLineBlame,
	formatDuration,
} from '../src/index'

const ROOT = process.cwd()

async function main() {
	console.log('🔍 Git Archaeologist — Basic Usage Examples\n')

	// ─── Example 1: Git Blame ────────────────────────────────────────
	console.log('📝 Example 1: Git Blame')
	console.log('─'.repeat(40))

	const blame = await collectBlame({
		root: ROOT,
		file: 'internal/development-plan.md',
		startLine: 1,
		endLine: 5,
	})

	console.log(`File: ${blame.file}`)
	console.log(`Lines: ${blame.lines.length}`)
	console.log(`Duration: ${formatDuration(blame.duration)}\n`)

	for (const line of blame.lines.slice(0, 3)) {
		console.log(formatLineBlame(line))
	}

	// ─── Example 2: Git Log ──────────────────────────────────────────
	console.log('\n📜 Example 2: Git Log')
	console.log('─'.repeat(40))

	const log = await collectLog({
		root: ROOT,
		log: { maxCount: 5 },
	})

	console.log(`Commits: ${log.commits.length}`)
	console.log(`Truncated: ${log.truncated}`)
	console.log(`Duration: ${formatDuration(log.duration)}\n`)

	for (const commit of log.commits.slice(0, 3)) {
		console.log(formatCommitShort(commit))
	}

	// ─── Example 3: Commit Detail ─────────────────────────────────────
	console.log('\n🔎 Example 3: Commit Detail')
	console.log('─'.repeat(40))

	if (log.commits[0]) {
		const detail = await collectCommitDetail({
			root: ROOT,
			hash: log.commits[0].hash,
		})

		console.log(`Hash: ${detail.commit.hash}`)
		console.log(`Message: ${detail.commit.message}`)
		console.log(`Author: ${detail.commit.author.name}`)
		console.log(`Files changed: ${detail.diff.files.length}`)
		console.log(`+${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
		console.log(`Duration: ${formatDuration(detail.duration)}`)
	}

	// ─── Example 4: Diff ─────────────────────────────────────────────
	console.log('\n📊 Example 4: Diff')
	console.log('─'.repeat(40))

	if (log.commits.length >= 2) {
		const diff = await collectDiff({
			root: ROOT,
			hash: log.commits[0].hash,
		})

		console.log(`Commit: ${log.commits[0].abbrevHash}`)
		console.log(`Files: ${diff.files.length}`)

		for (const file of diff.files.slice(0, 3)) {
			console.log(`  ${file.status} ${file.file} (+${file.additions}/-${file.deletions})`)
		}
	}

	// ─── Example 5: Rename Tracking ───────────────────────────────────
	console.log('\n📦 Example 5: Rename Tracking')
	console.log('─'.repeat(40))

	const follow = await collectFollow({
		root: ROOT,
		file: 'internal/development-plan.md',
	})

	console.log(`Current path: ${follow.currentPath}`)
	console.log(`Original path: ${follow.originalPath}`)
	console.log(`Renames: ${follow.renames.length}`)
	console.log(`Duration: ${formatDuration(follow.duration)}`)

	if (follow.renames.length > 0) {
		console.log('\nRename history:')
		for (const rename of follow.renames) {
			console.log(`  ${rename.from} → ${rename.to} (${rename.similarity}%)`)
		}
	}

	console.log('\n✅ All examples completed!')
}

main().catch(console.error)
