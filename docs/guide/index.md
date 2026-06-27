# Introduction

Git Archaeologist is an AI-powered git blame enhancer that helps you understand **WHY** code was written, not just **WHO** wrote it.

## The Problem

Traditional `git blame` tells you:
- Who wrote a line
- When it was written
- The commit hash

But it doesn't tell you:
- Why the code exists
- What business requirement drove it
- Whether it's intentional or a workaround
- How it evolved over time

## The Solution

Git Archaeologist traces the **decision history** of code:

1. **Data Collection** — Parse git commands into structured data
2. **Semantic Analysis** — Group commits, classify intent
3. **Narrative Generation** — Explain with evidence chains and confidence levels

## Confidence Levels

| Level | Meaning |
|-------|---------|
| 🟢 High | Has PR/Issue documentation |
| 🟡 Medium | Clear commit message |
| 🔴 Low | AI inference only |
