/**
 * Structured error classes for Git Archaeologist
 */

/** Error thrown when a git command fails */
export class GitCommandError extends Error {
	/** The git command that failed */
	readonly command: string
	/** The arguments passed to git */
	readonly args: readonly string[]
	/** The exit code (if available) */
	readonly exitCode: number | undefined
	/** The working directory where the command ran */
	readonly cwd: string | undefined

	constructor(options: {
		command?: string
		args?: readonly string[]
		exitCode?: number
		cwd?: string
		message?: string
		cause?: Error
	}) {
		const msg =
			options.message ??
			`git ${[options.command, ...(options.args ?? [])].join(' ')} failed${options.exitCode != null ? ` (exit ${options.exitCode})` : ''}`
		super(msg)
		this.name = 'GitCommandError'
		this.command = options.command ?? 'git'
		this.args = options.args ?? []
		this.exitCode = options.exitCode
		this.cwd = options.cwd
		// Preserve stack trace on V8
		if (options.cause && Error.captureStackTrace) {
			Error.captureStackTrace(this, GitCommandError)
		}
	}
}

/** Error thrown when parsing git output fails */
export class GitParseError extends Error {
	/** What was being parsed */
	readonly parser: string
	/** The raw input that failed to parse */
	readonly rawInput: string

	constructor(options: { parser: string; rawInput: string; message?: string }) {
		const msg = options.message ?? `Failed to parse ${options.parser} output`
		super(msg)
		this.name = 'GitParseError'
		this.parser = options.parser
		this.rawInput = options.rawInput
	}
}
