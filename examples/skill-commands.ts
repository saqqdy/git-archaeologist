/**
 * Skill commands demo for Git Archaeologist
 *
 * Demonstrates the commands available in the Claude Code Skill.
 * Run with: npx tsx examples/skill-commands.ts
 */

import {
	collectBlame,
	collectLog,
	collectCommitDetail,
	collectFollow,
	formatCommitShort,
	truncate,
} from '../src/index'

const ROOT = process.cwd()

/**
 * Simulates the `/why <file:line>` command
 */
async function whyCommand(file: string, line: number) {
	console.log(`\n🔍 /why ${file}:${line}`)
	console.log('='.repeat(50))

	const blame = await collectBlame({
		root: ROOT,
		file,
		startLine: line,
		endLine: line,
	})

	if (blame.lines.length === 0) {
		console.log('No blame info found.')
		return
	}

	const lineBlame = blame.lines[0]!
	const commit = lineBlame.commit

	console.log(`\n📖 原因追溯：`)
	console.log(`  1. [${commit.authorDate.slice(0, 10)}] ${truncate(commit.message, 60)}`)
	console.log(`     → ${formatCommitShort(commit)}`)
	console.log(`     → 作者: ${commit.author.name}`)

	const confidence = commit.message ? '🟡' : '🔴'
	console.log(`\n💡 结论：该行由 ${commit.author.name} 在 ${commit.authorDate.slice(0, 10)} 修改`)
	console.log(`   置信度：${confidence}`)

	console.log(`\n💭 可追问：/history ${file}`)
}

/**
 * Simulates the `/history <path>` command
 */
async function historyCommand(file: string) {
	console.log(`\n📅 /history ${file}`)
	console.log('='.repeat(50))

	const [log, follow] = await Promise.all([
		collectLog({
			root: ROOT,
			log: { paths: [file], maxCount: 10 },
		}),
		collectFollow({ root: ROOT, file }),
	])

	console.log(`\n📁 文件信息：`)
	console.log(`   当前: ${follow.currentPath}`)
	console.log(`   原始: ${follow.originalPath}`)

	console.log(`\n📜 演变时间线：\n`)

	for (let i = 0; i < Math.min(log.commits.length, 5); i++) {
		const commit = log.commits[i]!
		console.log(`  ${commit.authorDate.slice(0, 10)} ${truncate(commit.message, 40)}`)
		console.log(`     → \`${commit.abbrevHash}\` by ${commit.author.name}`)
	}

	if (follow.renames.length > 0) {
		console.log(`\n🔑 重命名：`)
		for (const r of follow.renames) {
			console.log(`   ${r.from} → ${r.to}`)
		}
	}
}

/**
 * Simulates the `/context <hash>` command
 */
async function contextCommand(hash: string) {
	console.log(`\n🔗 /context ${hash}`)
	console.log('='.repeat(50))

	const detail = await collectCommitDetail({ root: ROOT, hash })

	console.log(`\n📦 Commit：`)
	console.log(`   ${detail.commit.message}`)
	console.log(`   Author: ${detail.commit.author.name}`)

	console.log(`\n📝 变更文件 (${detail.diff.files.length})：\n`)

	for (const file of detail.diff.files.slice(0, 5)) {
		const icon = { added: '➕', deleted: '❌', modified: '📝', renamed: '📦' }[file.status]
		console.log(`  ${icon} ${file.file} (+${file.additions}/-${file.deletions})`)
	}

	console.log(`\n💡 +${detail.diff.totalAdditions}/-${detail.diff.totalDeletions}`)
}

// ─── Run demos ────────────────────────────────────────────────────────

async function main() {
	console.log('🎯 Git Archaeologist — Skill Commands Demo\n')

	const log = await collectLog({ root: ROOT, log: { maxCount: 1 } })
	const recentHash = log.commits[0]?.hash ?? 'HEAD'

	await whyCommand('internal/development-plan.md', 1)
	await historyCommand('internal/development-plan.md')
	await contextCommand(recentHash)

	console.log('\n✅ 演示完成!')
	console.log('\n💡 安装 skill 后可用：/why, /history, /context, /decisions')
}

main().catch(console.error)
