# Git Unearth — 详细开发计划

> `git blame` 增强版：理解"这段代码为什么写成这样"而非只是"谁写的"

---

## 一、项目定位

### 核心问题

开发者接手代码时，最常问的问题不是"这行谁写的"，而是：

- **"为什么这里用了这个设计模式？"**
- **"这个看起来很奇怪的 workaround 是为了解决什么问题？"**
- **"这个函数经历了怎样的演变才变成现在这样？"**
- **"当初为什么不选更直观的方案？"**

`git blame` 只回答了 **who + when**，Git Unearth 回答 **why**。

### AI 不可替代性

| 能力 | git blame / log | 规则脚本 | Git Unearth (AI) |
|------|:---:|:---:|:---:|
| 定位谁写的 | ✅ | ✅ | ✅ |
| 关联 PR/Issue | ❌ | 部分可做 | ✅ |
| 理解 commit message 语义 | ❌ | ❌ | ✅ |
| 从 diff 推断意图 | ❌ | ❌ | ✅ |
| 生成代码演变叙事 | ❌ | ❌ | ✅ |
| 识别架构决策 | ❌ | ❌ | ✅ |
| 跨文件关联变更 | ❌ | 部分可做 | ✅ |

### 目标用户

- 接手遗留代码的开发者
- Code Review 时需要理解上下文的人
- 技术写作者 / 文档维护者
- 架构师回溯决策历史

---

## 二、核心命令设计

### `/why <file:line>` — 为什么这样写？

分析指定代码行/块，生成交叉验证的因果解释：

```
> /why src/auth/login.ts:42

🔍 分析 `validateToken()` 中的 try-catch 双重包裹...

📖 原因追溯：
  1. [2024-03-15] feat: add token validation (commit a1b2c3)
     → 初始实现，简单 try-catch
  2. [2024-05-22] fix: handle expired token race condition (PR #234 → Issue #189)
     → 外层 try-catch 是为了捕获 token 刷新期间的竞态条件
     → Issue #189 报告了并发刷新导致用户被登出的问题

💡 结论：双重 try-catch 是为了解决并发 token 刷新的竞态条件，
   不是冗余代码。相关测试在 auth.test.ts:87。
```

### `/history <path|function>` — 演变时间线

展示代码从诞生到现在的完整演变故事：

```
> /history src/utils/format.ts

📅 演变时间线 (format.ts):

  2023-06-10 🌱 创建
    → 初始实现，仅支持日期格式化
    → Commit: "add date formatting utility"

  2023-08-15 🔄 重构
    → 从 moment.js 迁移到 dayjs (bundle 减小 67KB)
    → PR #89: "migrate to dayjs for smaller bundle"
    → 关联 Issue #67: 页面加载速度优化

  2024-01-20 ➕ 扩展
    → 新增时区处理逻辑
    → PR #156: "add timezone support for international users"
    → 产品需求：海外用户显示本地时间

  2024-04-03 🐛 修复
    → 修复 DST 切换期间的偏移错误
    → Commit: "fix DST offset calculation"
    → 添加了复杂的偏移计算 (当前第 34-58 行)

🔑 关键决策：
  - 选择 dayjs 而非 date-fns：bundle size 优先
  - DST 处理选择了手动计算而非依赖库：避免额外依赖
```

### `/context <code-snippet>` — 上下文关联

找到与指定代码语义相关的其他变更：

```
> /context "retryWithBackoff"

🔗 关联变更网络：

  直接关联 (同一 commit):
  └─ src/api/client.ts → 使用 retryWithBackoff 做请求重试

  间接关联 (相关 commit):
  └─ src/api/interceptor.ts → 添加了请求超时配置
  └─ src/config/constants.ts → 定义了 MAX_RETRY_COUNT = 3
  └─ tests/api/retry.test.ts → 重试策略的测试

  相关 Issue:
  └─ #312 → API 请求在弱网环境下频繁失败
  └─ #298 → 移动端网络不稳定需要更智能的重试
```

### `/decisions` — 架构决策考古

从 git 历史中提取关键架构决策：

```
> /decisions src/auth/

🏛️ 架构决策记录 (从 git 历史重建):

  决策 #1: 使用 JWT 而非 Session
    时间: 2023-04-10
    证据: PR #12, commit "switch to JWT authentication"
    上下文: 初始架构选型，考虑了水平扩展需求
    影响: 所有 auth 模块代码

  决策 #2: Token 刷新采用静默刷新策略
    时间: 2023-09-18
    证据: PR #67, Issue #45
    上下文: 用户反馈 token 过期后需要重新登录体验差
    逆转成本: 高 (影响 auth flow 全链路)

  决策 #3: 权限校验放至前端而非仅后端
    时间: 2024-01-05
    证据: PR #123, 技术方案文档
    上下文: 前端需要根据权限控制 UI 展示
    ⚠️ 争议: Review 中有人认为前端权限不可靠
```

### `/archaeology <area>` — 深度考古模式

交互式深度调查，支持追问：

```
> /archaeology src/payment/

⛏️ 深度考古: src/payment/

  这片区域有 247 次提交，跨 23 位作者，横跨 14 个月。
  检测到 3 个高风险决策点和 5 个可能的 workaround。

  🔍 发现 #1: calculateDiscount() 中有大量硬编码的折扣规则
     最后修改: 2024-03-20
     可能原因: 快速迭代促销活动，来不及抽象

  🔍 发现 #2: processRefund() 中有 500ms 的 sleep
     来源: PR #456 (hotfix)
     可能原因: 等待下游系统异步写入完成

  💬 你可以追问：
    - "告诉我在发现 #2 中 sleep 的完整上下文"
    - "发现 #1 的折扣规则是谁设计的？"
    - "这个区域经历过哪些重构？"
```

---

## 三、技术架构

```
┌─────────────────────────────────────────┐
│           Claude Code Skill Layer        │
│  (commands: /why, /history, /context...) │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         AI Narrative Engine              │
│  ┌─────────────┐ ┌──────────────────┐   │
│  │ Intent      │ │ Narrative        │   │
│  │ Inference   │ │ Synthesis        │   │
│  └─────────────┘ └──────────────────┘   │
│  ┌─────────────┐ ┌──────────────────┐   │
│  │ Decision    │ │ Confidence       │   │
│  │ Extractor   │ │ Scorer           │   │
│  └─────────────┘ └──────────────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Analysis Engine                 │
│  ┌─────────────┐ ┌──────────────────┐   │
│  │ Commit      │ │ Change           │   │
│  │ Grouper     │ │ Hotspot Detector │   │
│  └─────────────┘ └──────────────────┘   │
│  ┌─────────────┐ ┌──────────────────┐   │
│  │ Author      │ │ Evolution        │   │
│  │ Expertise   │ │ Timeline Builder │   │
│  └─────────────┘ └──────────────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Data Collection Layer          │
│  ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │ git      │ │GitHub  │ │ GitLab    │  │
│  │ commands │ │API     │ │ API       │  │
│  └──────────┘ └────────┘ └───────────┘  │
│  ┌──────────┐ ┌────────┐               │
│  │ Cache    │ │ Config │               │
│  │ Store    │ │ Manager│               │
│  └──────────┘ └────────┘               │
└─────────────────────────────────────────┘
```

---

## 四、分阶段开发计划

### Phase 1: Git 数据采集层 (第 1-2 天)

**目标**：构建可靠的 git 命令封装，输出结构化数据

#### 1.1 Git 命令封装

| 命令 | 用途 | 输出 |
|------|------|------|
| `git blame --line-porcelain` | 行级归属 | CommitInfo[] |
| `git log --format=json` | 提交历史 | CommitLog[] |
| `git diff <commit>` | 变更详情 | FileDiff[] |
| `git show <commit>` | 完整提交内容 | CommitDetail |
| `git log --follow` | 跟踪重命名 | RenameHistory |
| `git log --all-match --grep` | 语义搜索 | CommitLog[] |
| `git rev-list --ancestry-path` | 提交链追踪 | CommitChain |

#### 1.2 数据模型

```typescript
// 核心数据结构
interface CommitInfo {
  hash: string
  author: { name: string; email: string }
  date: string
  message: string
  parents: string[]
}

interface LineBlame {
  file: string
  line: number
  commit: CommitInfo
  content: string
}

interface FileDiff {
  file: string
  additions: number
  deletions: number
  hunks: DiffHunk[]
}

interface DiffHunk {
  oldStart: number
  newStart: number
  oldLines: string[]
  newLines: string[]
}
```

#### 1.3 缓存策略

- 短期缓存：当前 session 内重复查询 (Map)
- 中期缓存：按 commit hash 缓存解析结果 (文件系统, TTL 24h)
- 长期缓存：项目级分析结果 (`.git-unearth/` 目录)

**验证标准**：
- ✅ 正确解析含中文/特殊字符的 commit message
- ✅ 正确处理文件重命名
- ✅ 缓存命中率 >50% (重复查询场景)

---

### Phase 2: 分析引擎 (第 3-5 天)

**目标**：从原始 git 数据中提取语义信息

#### 2.1 Commit 分组算法

将原子 commit 聚合为有意义的变更单元：

```
原子 commit → 变更组 (Change Group)

分组维度：
1. Merge commit → 合并其包含的所有原子 commit
2. 同一 PR 的 commit → 按 PR 关联
3. 时间相近的原子 commit (<5min) → 猜测为同一意图的 amend/fixup
4. 同一分支的连续 commit → 按功能分支聚合
```

#### 2.2 意图分类器

从 commit message + diff 推断变更意图：

| 分类 | 特征 | 示例 |
|------|------|------|
| feat | 新增文件/函数/端点 | "add user profile page" |
| fix | 修改条件判断、添加空检查 | "fix null pointer in auth" |
| refactor | 代码重组但行为不变 | "extract helper function" |
| perf | 算法优化、惰性加载 | "lazy load images" |
| workaround | hack、TODO、临时方案 | "temp fix for..." |
| revert | 回退操作 | "revert commit abc" |
| deps | 依赖变更 | "upgrade react to 18" |

分类策略：commit message 关键词 + diff 模式匹配 → AI 二次确认

#### 2.3 变更热点检测

识别代码中的"活跃区域"：

```
热点评分 = 修改频率 × 影响范围 × 最近活跃度

输出：
- 🔴 高热点 (>8分): 频繁变更，可能有设计问题
- 🟡 中热点 (4-8分): 正常迭代区域
- 🟢 低热点 (<4分): 稳定代码
```

#### 2.4 作者专长映射

从历史提交推断每个人的代码领域专长：

```
张三 → auth 模块 (82 commits), payment (15 commits)
李四 → utils (45 commits), formatting (38 commits)
王五 → UI 组件 (120 commits), 样式 (90 commits)
```

**验证标准**：
- ✅ Commit 分组后，每组 commit 数量 <=5 个 (非 merge 情况)
- ✅ 意图分类准确率 >85% (在 3 个已知仓库上验证)
- ✅ 热点检测能识别出最近 30 天变更最多的 Top 5 文件

---

### Phase 3: PR/Issue 上下文集成 (第 6-7 天)

**目标**：连接 git 历史与项目管理上下文

#### 3.1 GitHub 集成

```
commit hash → GitHub Search API → PR → {
  title, body, labels,
  reviews: [{ author, body, state }],
  linked_issues: [{ number, title, body, labels }],
  comments: [{ author, body }]
}
```

#### 3.2 GitLab 集成

```
commit hash → GitLab API → MR → {
  title, description, labels,
  discussions: [{ author, notes }],
  related_issues: [{ iid, title, description }]
}
```

#### 3.3 语义关联

从 PR/Issue 内容中提取关键上下文：

- **问题背景**：Issue 中描述的 bug/需求
- **方案讨论**：Review comments 中的设计决策
- **约束条件**：性能要求、兼容性、截止日期
- **替代方案**：被否决的方案和原因

**验证标准**：
- ✅ GitHub 仓库的 commit → PR → Issue 链路完整打通
- ✅ API 限流下优雅降级 (显示已有信息 + 标注"上下文不完整")
- ✅ 私有仓库通过 `gh auth` 鉴权正常工作

---

### Phase 4: AI 叙事引擎 (第 8-10 天)

**目标**：将结构化数据转化为人类可读的解释

#### 4.1 `/why` 命令实现

执行流程：
```
输入: file:line
  → git blame → 定位 commit
  → git log --follow → 追踪演变
  → PR/Issue 查询 → 获取上下文
  → AI 分析 → 因果推理
  → 输出: 解释 + 证据链
```

叙事结构：
1. **直接原因**（最近的变更 + commit message）
2. **深层原因**（关联的 Issue/PR 讨论）
3. **历史背景**（更早的相关决策）
4. **结论**（综合解释 + 置信度）

#### 4.2 `/history` 命令实现

执行流程：
```
输入: 文件/函数路径
  → git log --follow → 完整变更时间线
  → Commit 分组 → 聚合为有意义的事件
  → 意图分类 + PR 关联 → 丰富上下文
  → AI 生成 → 演变叙事
  → 输出: 时间线 + 关键决策
```

#### 4.3 `/context` 命令实现

执行流程：
```
输入: 代码片段/函数名
  → 语义搜索 → 关联的代码区域
  → 跨文件 commit 分析 → 相关变更
  → AI 推理 → 关联网络
  → 输出: 直接/间接关联 + 关系类型
```

#### 4.4 `/decisions` 命令实现

执行流程：
```
输入: 代码区域 (可选)
  → 扫描大变更 commit → 候选决策点
  → PR/Issue 分析 → 决策上下文
  → 分类 + 重要性评分 → 架构决策列表
  → AI 生成 → 决策记录格式
  → 输出: 类 ADR 格式的决策记录
```

#### 4.5 置信度评分

每个解释附带置信度：
- 🟢 **高置信** (80%+)：有明确的 Issue/PR 讨论佐证
- 🟡 **中置信** (50-80%)：commit message 清晰但缺少讨论
- 🔴 **低置信** (<50%)：commit message 含糊，AI 主要靠推断

**验证标准**：
- ✅ `/why` 输出的解释与人工阅读 git 历史得出的结论一致 (>80%)
- ✅ 每个解释包含可追溯的证据链 (commit → PR → Issue)
- ✅ 低置信度解释被明确标注

---

### Phase 5: 交互与分发 (第 11-14 天)

**目标**：打磨体验并发布

#### 5.1 交互式追问

在 `/archaeology` 模式下，支持自然语言追问：

```
用户: 为什么这里有 sleep(500)?
Archaeologist: [解释原因...]

用户: 那下游系统什么时候写入完成的？
Archaeologist: [基于 commit 历史继续追踪...]

用户: 有没有计划去掉这个 workaround？
Archaeologist: [搜索相关 TODO/Issue...]
```

#### 5.2 性能优化

- 大仓库策略：默认只分析最近 N 个月 (>12月 需显式指定)
- 增量分析：只分析新 commit 的增量变化
- 并行查询：git 命令 + API 调用并行执行
- 预热缓存：项目打开时后台预热常用分析

#### 5.3 配置化

```json
{
  "gitArchaeologist": {
    "maxHistoryMonths": 12,
    "cacheDir": ".git-unearth",
    "cacheTTL": 86400,
    "githubToken": "env:GITHUB_TOKEN",
    "gitlabToken": "env:GITLAB_TOKEN",
    "excludePaths": ["vendor/", "node_modules/"],
    "commitGroupWindow": "5m"
  }
}
```

#### 5.4 文档与示例

- README：5 分钟快速上手
- 示例仓库：用知名开源项目演示输出效果
- 进阶用法：CI 集成、团队协作场景

**验证标准**：
- ✅ 1000+ commit 的仓库首次分析 <30s
- ✅ 配置文件缺失时使用合理默认值
- ✅ README 足以让新用户独立上手

---

## 五、文件结构规划

```
git-unearth/
├── CLAUDE.md                    # 项目指引
├── package.json
├── tsconfig.json
├── src/
│   ├── commands/                # Claude Code 命令
│   │   ├── why.ts               # /why 命令
│   │   ├── history.ts           # /history 命令
│   │   ├── context.ts           # /context 命令
│   │   ├── decisions.ts         # /decisions 命令
│   │   └── archaeology.ts       # /archaeology 命令
│   ├── collectors/              # 数据采集层
│   │   ├── git-blame.ts         # blame 解析
│   │   ├── git-log.ts           # log 解析
│   │   ├── git-diff.ts          # diff 解析
│   │   ├── git-follow.ts        # 重命名跟踪
│   │   └── git-cache.ts         # 缓存管理
│   ├── integrations/            # 外部集成
│   │   ├── github.ts            # GitHub API
│   │   └── gitlab.ts            # GitLab API
│   ├── analyzers/               # 分析引擎
│   │   ├── commit-grouper.ts    # Commit 分组
│   │   ├── intent-classifier.ts # 意图分类
│   │   ├── hotspot-detector.ts  # 热点检测
│   │   ├── expertise-mapper.ts  # 作者专长
│   │   └── timeline-builder.ts  # 时间线构建
│   ├── narrators/               # AI 叙事层
│   │   ├── why-narrator.ts      # /why 叙事
│   │   ├── history-narrator.ts  # /history 叙事
│   │   ├── context-narrator.ts  # /context 叙事
│   │   └── decisions-narrator.ts# /decisions 叙事
│   ├── models/                  # 数据模型
│   │   └── types.ts             # TypeScript 类型定义
│   └── utils/                   # 工具函数
│       ├── config.ts            # 配置管理
│       └── format.ts            # 输出格式化
├── tests/                       # 测试
│   ├── collectors/
│   ├── analyzers/
│   └── fixtures/                # 测试仓库 fixture
└── docs/                        # 文档
    ├── README.md
    └── examples/
```

---

## 六、风险与缓解

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| 大仓库分析慢 | 用户体验差 | 限制默认分析范围 + 增量分析 + 缓存 |
| Commit message 质量差 | AI 推断不准确 | 从 diff + Issue 双向推断；低置信度标注 |
| GitHub API 限流 | PR/Issue 上下文缺失 | 本地缓存 + 优雅降级 + Token 轮换 |
| 隐私问题 | 访问私有仓库受限 | 仅使用用户本地 `gh auth`，不存储凭据 |
| 复杂重构跨多文件 | 关联分析困难 | 基于 commit 关联而非代码相似度 |

---

## 七、成功指标

| 指标 | 目标 |
|------|------|
| 理解代码原因的时间 | 从 30+ 分钟降至 <5 分钟 |
| 解释准确率 | >80% (与人工阅读历史对比) |
| 首次分析速度 | <30s (1000+ commit 仓库) |
| 支持的 Git 平台 | GitHub, GitLab |
| 置信度标注覆盖率 | 100% 解释附带置信度 |

---

## 八、后续扩展方向

1. **团队知识图谱** — 将个人的代码认知沉淀为可查询的知识库
2. **Code Review 增强集成** — Review PR 时自动展示相关决策上下文
3. **CI 集成** — 在 CI 流水中标注高风险变更区域
4. **多仓库关联** — 跨微服务的变更因果分析
5. **决策回溯预警** — 当新变更可能推翻旧决策时发出警告
