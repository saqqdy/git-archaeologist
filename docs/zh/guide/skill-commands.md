# Skill 命令

Git Unearth 在 Claude Code 中提供交互式 unearth 命令。

## 可用命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `/why <file:line>` | 为什么这样写？追溯决策历史 | `/why src/index.ts:42` |
| `/history <path>` | 演变时间线 | `/history src/components/` |
| `/context <hash>` | 相关变更网络 | `/context abc1234` |
| `/decisions [area]` | 架构决策记录 | `/decisions src/` |
| `/unearth <area>` | 深度交互式调查 | `/unearth src/` |

## `/why` — 追溯决策历史

理解特定代码背后的原因。

**用法**:
```
/why src/utils/format.ts:32
```

**输出**:
```
🔍 分析 formatDuration()...

📖 原因追溯:
  1. [2024-06-10] Add formatDuration helper (def456)
     → 跨 reporter 的共享时间格式化
  2. [2024-06-05] PR #42 → Issue #18
     → 用户报告时间显示不友好

💡 结论: 一致时间显示的工具函数 (🟢 高置信度)

💭 后续:
   - /history src/utils/format.ts
   - /context def456
```

## `/history` — 演变时间线

查看文件或目录随时间的演变。

**用法**:
```
/history src/collectors/git-blame.ts
```

**输出**:
```
📅 演变时间线 (git-blame.ts):

  2024-06-15 🔄 Fix porcelain parsing
    → abc123 - 处理 RS/US 分隔符的边界情况

  2024-06-10 🌱 Initial implementation
    → def456 - 添加行级 blame 收集

🔑 关键决策:
  - 使用 RS/US 分隔符确保可靠解析
  - 在会话级别缓存结果
```

## `/context` — 相关变更网络

查找与特定变更相关的提交。

**用法**:
```
/context abc1234
```

**输出**:
```
🔍 abc1234 的上下文网络:

  相关提交:
    def456 ← 上一个: 添加初始功能
    ghi789 → 下一个: 修复边界情况
    jkl012 ↔ 并行: 更新测试

  共享文件:
    src/index.ts (3 次提交)
    src/utils.ts (2 次提交)

  受以下影响:
    Issue #42 - 用户报告 bug
    PR #43 - 重构
```

## `/decisions` — 架构决策记录

从 git 历史提取 ADR。

**用法**:
```
/decisions src/
```

**输出**:
```
📋 架构决策 (src/):

  1. [2024-06-10] 使用 RS/US 分隔符解析
     → 可靠的 git 输出解析
     → 提交: def456

  2. [2024-06-05] 三层缓存策略
     → 性能优化
     → 提交: abc123

  3. [2024-05-28] TypeScript 优先 API
     → 类型安全和 IDE 支持
     → 提交: ghi789
```

## `/unearth` — 深度调查

交互式引导探索代码历史。

**用法**:
```
/unearth src/auth/
```

**交互会话**:
```
🔬 Unearth 模式 (src/auth/)

  我将帮助你调查 src/auth/。你想探索什么？

  1. 这段代码为什么存在？
  2. 它是如何演变的？
  3. 有哪些关键决策？
  4. 是否有任何变通方案？
  5. 自定义问题

  选择 1-5: _
```

## 置信度级别

命令根据证据返回置信度级别:

| 级别 | 来源 | 含义 |
|------|------|------|
| 🟢 高 | PR/Issue 文档 | 已验证的业务需求 |
| 🟡 中 | 清晰的提交消息 | 提交中的明确意图 |
| 🔴 低 | 仅 AI 推断 | 基于模式的推理 |

## 技巧

### 有效使用

1. **从 `/why` 开始** — 理解特定行
2. **使用 `/history` 获取上下文** — 查看全局图景
3. **跟进 `/context`** — 发现关系
4. **提取 `/decisions`** — 文档化架构

### 组合命令

链式命令以获得更深入的洞察:

```
/why src/auth.ts:42
  → 揭示提交 abc123
/context abc123
  → 显示相关变更
/history src/auth.ts
  → 显示演变时间线
```

## 编程访问

所有 skill 命令使用底层 API。你可以通过编程实现相同的结果:

```typescript
import { collectBlame, collectLog, createCacheStore } from 'git-unearth'

// 等同于 /why
const blame = await collectBlame({
  root: process.cwd(),
  file: 'src/index.ts',
  startLine: 42,
  endLine: 42,
  cache: createCacheStore(),
})

// 等同于 /history
const log = await collectLog({
  root: process.cwd(),
  log: { paths: ['src/'] },
  cache: createCacheStore(),
})
```

详见 [API 参考](/api/)。
