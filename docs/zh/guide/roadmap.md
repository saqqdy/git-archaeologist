# 版本路线图

Git Unearth 通过主题化发布不断演进，每个版本都增加一层智能能力。

## 当前版本

### v0.1.1 — Daybreak (已发布)

**主题**: 数据采集层

**功能**:
- ✅ `collectBlame()` — 行级 blame 及提交元数据
- ✅ `collectLog()` — 提交历史，支持 RS/US 分隔符解析
- ✅ `collectDiff()` / `collectDiffBetween()` — 统一差异格式及代码块
- ✅ `collectFollow()` — 文件重命名追踪
- ✅ `collectCommitDetail()` — 单次调用获取完整提交 + 差异
- ✅ 三级缓存 (Session → Filesystem → None)
- ✅ CLI 支持，零安装 `npx` 方式
- ✅ TypeScript/Node.js API

**使用场景**:
- 程序化 git unearth
- 构建自定义分析工具
- 零依赖 CLI 工作流

## 计划版本

### v0.2.0 — Sunrise

**主题**: 分析引擎

**计划功能**:
- 提交分组 (merge/PR/时间窗口)
- 意图分类 (feat/fix/refactor/perf/workaround)
- 关联提交检测
- 基础模式识别

### v0.3.0 — Dawn

**主题**: 决策时间线 + ADR

**计划功能**:
- 决策时间线构建
- 架构决策记录 (ADR) 生成
- 与 issues/PRs 交叉引用
- 证据链可视化

### v0.4.0 — Ember

**主题**: 交互式 Unearth

**计划功能**:
- 交互式调查向导
- 引导式探索模式
- 问题驱动分析
- 协作式 unearth 会话

### v1.0.0 — Lighthouse

**主题**: 生产就绪

**计划功能**:
- Claude Code 插件市场
- 性能优化
- 完整文档
- 企业级功能
- 社区建设

## 发布理念

- **增量价值**: 每个版本都交付可用功能
- **向后兼容**: API 在小版本间保持稳定
- **社区驱动**: 路线图由用户反馈塑造

## 参与贡献

对未来版本有想法？[提交 issue](https://github.com/saqqdy/git-unearth/issues) 或参与讨论。

## 更新日志

查看 [CHANGELOG.md](https://github.com/saqqdy/git-unearth/blob/master/CHANGELOG.md) 了解发布历史。