/**
 * Git Unearth CLI — Quick experience without installation
 *
 * Usage: npx git-unearth <command> [options]
 *
 * Commands:
 *   blame <file> [--start N] [--end N]  Line-level blame
 *   log [--max-count N] [--path P]      Commit history
 *   diff <hash>                         Diff for a commit
 *   follow <file>                       Rename tracking
 *   detail <hash>                       Full commit detail
 */

import { parseArgs } from 'node:util'
import {
	collectBlame,
	collectCommitDetail,
	collectDiff,
	collectFollow,
	collectLog,
	formatCommitShort,
	formatDuration,
	formatFileDiff,
	formatLineBlame,
	formatRename,
} from './index.js'

const VERSION = '0.1.1'

const COMMANDS = ['blame', 'log', 'diff', 'follow', 'detail', 'help', 'version'] as const
type Command = (typeof COMMANDS)[number]

function printHelp(): void {
	console.log(`
🔍 Git Unearth v${VERSION} — Semantic Code Unearth

Usage:
  npx git-unearth <command> [options]

Commands:
  blame <file>           Line-level blame for a file
    --start N            Start line (1-based)
    --end N              End line (inclusive)

  log                    Commit history
    --max-count N        Limit to N commits
    --path P             Filter by path

  diff <hash>            Diff for a specific commit

  follow <file>          Track file renames

  detail <hash>          Full commit metadata + diff

  help                   Show this help
  version                Show version

Examples:
  npx git-unearth blame src/index.ts
  npx git-unearth blame src/index.ts --start 1 --end 10
  npx git-unearth log --max-count 5
  npx git-unearth log --path src/
  npx git-unearth diff abc1234
  npx git-unearth follow src/index.ts
  npx git-unearth detail abc1234
`)
}

function printVersion(): void {
	console.log(`git-unearth v${VERSION}`)
}

async function runBlame(args: string[]): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			start: { type: 'string', short: 's' },
			end: { type: 'string', short: 'e' },
		},
		strict: false,
	})

	const file = args[0]
	if (!file) {
		console.error('Error: missing file argument')
		console.log('Usage: npx git-unearth blame <file> [--start N] [--end N]')
		process.exit(1)
	}

	const startLine = values.start ? Number(values.start) : undefined
	const endLine = values.end ? Number(values.end) : undefined

	const result = await collectBlame({
		root: process.cwd(),
		file,
		startLine,
		endLine,
	})

	console.log(`\n📝 Blame for ${file}`)
	console.log(`   Lines: ${result.lines.length}`)
	console.log(`   Duration: ${formatDuration(result.duration)}\n`)

	for (const line of result.lines) {
		console.log(formatLineBlame(line))
	}
}

async function runLog(args: string[]): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			maxCount: { type: 'string', short: 'n' },
			path: { type: 'string', short: 'p' },
		},
		strict: false,
	})

	const maxCount = values.maxCount ? Number(values.maxCount) : 10
	const pathValue = values.path
	const paths = typeof pathValue === 'string' ? [pathValue] : undefined

	const result = await collectLog({
		root: process.cwd(),
		log: { maxCount, paths },
	})

	console.log(`\n📜 Commit History`)
	console.log(`   Commits: ${result.commits.length}`)
	console.log(`   Truncated: ${result.truncated}`)
	console.log(`   Duration: ${formatDuration(result.duration)}\n`)

	for (const commit of result.commits) {
		console.log(formatCommitShort(commit))
	}
}

async function runDiff(args: string[]): Promise<void> {
	const hash = args[0]
	if (!hash) {
		console.error('Error: missing hash argument')
		console.log('Usage: npx git-unearth diff <hash>')
		process.exit(1)
	}

	const result = await collectDiff({
		root: process.cwd(),
		hash,
	})

	console.log(`\n📊 Diff for ${hash}`)
	console.log(`   Files: ${result.files.length}`)
	console.log(`   +${result.totalAdditions}/-${result.totalDeletions}`)
	console.log(`   Duration: ${formatDuration(result.duration)}\n`)

	for (const file of result.files) {
		console.log(formatFileDiff(file))
	}
}

async function runFollow(args: string[]): Promise<void> {
	const file = args[0]
	if (!file) {
		console.error('Error: missing file argument')
		console.log('Usage: npx git-unearth follow <file>')
		process.exit(1)
	}

	const result = await collectFollow({
		root: process.cwd(),
		file,
	})

	console.log(`\n📦 Rename History for ${file}`)
	console.log(`   Current: ${result.currentPath}`)
	console.log(`   Original: ${result.originalPath}`)
	console.log(`   Renames: ${result.renames.length}`)
	console.log(`   Duration: ${formatDuration(result.duration)}\n`)

	if (result.renames.length > 0) {
		for (const rename of result.renames) {
			console.log(formatRename(rename))
		}
	} else {
		console.log('   No renames detected')
	}
}

async function runDetail(args: string[]): Promise<void> {
	const hash = args[0]
	if (!hash) {
		console.error('Error: missing hash argument')
		console.log('Usage: npx git-unearth detail <hash>')
		process.exit(1)
	}

	const result = await collectCommitDetail({
		root: process.cwd(),
		hash,
	})

	console.log(`\n🔎 Commit Detail for ${hash}`)
	console.log(`   Message: ${result.commit.message}`)
	console.log(`   Author: ${result.commit.author.name} <${result.commit.author.email}>`)
	console.log(`   Date: ${result.commit.authorDate}`)
	console.log(`   Files: ${result.diff.files.length}`)
	console.log(`   +${result.diff.totalAdditions}/-${result.diff.totalDeletions}`)
	console.log(`   Duration: ${formatDuration(result.duration)}\n`)

	for (const file of result.diff.files) {
		console.log(formatFileDiff(file))
	}
}

async function main(): Promise<void> {
	const args = process.argv.slice(2)
	const command = args[0] as Command

	if (!command || !COMMANDS.includes(command)) {
		printHelp()
		process.exit(1)
	}

	switch (command) {
		case 'help':
			printHelp()
			break
		case 'version':
			printVersion()
			break
		case 'blame':
			await runBlame(args.slice(1))
			break
		case 'log':
			await runLog(args.slice(1))
			break
		case 'diff':
			await runDiff(args.slice(1))
			break
		case 'follow':
			await runFollow(args.slice(1))
			break
		case 'detail':
			await runDetail(args.slice(1))
			break
	}
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
