# 安装

## 方式 1：Claude Code 插件市场（推荐）

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/git-unearth
/plugin install git-unearth
```

## 方式 2：本地安装

```bash
cd your-project
pnpm add -D git-unearth

mkdir -p .claude/skills
cp -r node_modules/git-unearth/.claude/skills/git-unearth .claude/skills/
```

## 方式 3：克隆运行示例

```bash
git clone https://github.com/saqqdy/git-unearth.git
cd git-unearth
pnpm install
npx tsx examples/basic-usage.ts
```
