# Version Roadmap

Git Unearth evolves through themed releases, each adding a layer of intelligence.

## Current Release

### v0.1.0 — Daybreak (Released)

**Theme**: Data Collection Layer

**Capabilities**:
- ✅ `collectBlame()` — Line-level blame with commit metadata
- ✅ `collectLog()` — Commit history with RS/US delimiter parsing
- ✅ `collectDiff()` / `collectDiffBetween()` — Unified diff with hunks
- ✅ `collectFollow()` — File rename tracking
- ✅ `collectCommitDetail()` — Full commit + diff in one call
- ✅ Three-tier caching (Session → Filesystem → None)
- ✅ CLI with zero-install `npx` support
- ✅ TypeScript/Node.js API

**Use Cases**:
- Programmatic git unearth
- Building custom analysis tools
- Zero-dependency CLI workflows

## Planned Releases

### v0.2.0 — Sunrise

**Theme**: Analysis Engine

**Planned Features**:
- Commit grouping (merge/PR/time window)
- Intent classification (feat/fix/refactor/perf/workaround)
- Related commit detection
- Basic pattern recognition

### v0.3.0 — Dawn

**Theme**: Decision Timeline + ADR

**Planned Features**:
- Decision timeline construction
- Architecture Decision Records (ADR) generation
- Cross-reference with issues/PRs
- Evidence chain visualization

### v0.4.0 — Ember

**Theme**: Interactive Unearth

**Planned Features**:
- Interactive investigation wizard
- Guided exploration modes
- Question-driven analysis
- Collaborative unearth sessions

### v1.0.0 — Lighthouse

**Theme**: Production Ready

**Planned Features**:
- Claude Code Plugin Marketplace
- Performance optimization
- Comprehensive documentation
- Enterprise features
- Community building

## Release Philosophy

- **Incremental Value**: Each release delivers usable features
- **Backward Compatible**: APIs remain stable across minor versions
- **Community Driven**: Roadmap shaped by user feedback

## Contributing

Have ideas for future releases? [Open an issue](https://github.com/saqqdy/git-unearth/issues) or join discussions.

## Changelog

See [CHANGELOG.md](https://github.com/saqqdy/git-unearth/blob/master/CHANGELOG.md) for release history.
