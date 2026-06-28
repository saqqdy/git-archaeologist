import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/git-unearth/',
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
  ],
  locales: {
    root: {
      description: 'AI-powered git blame enhancer — understand WHY code was written',
      label: 'English',
      lang: 'en',
      themeConfig: {
        darkModeSwitchLabel: 'Theme',
        docFooter: { next: 'Next', prev: 'Previous' },
        editLink: {
          pattern: 'https://github.com/saqqdy/git-unearth/edit/master/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: { copyright: 'Copyright © 2024-present saqqdy', message: 'MIT License' },
        lastUpdated: { text: 'Updated at' },
        nav: [
          { activeMatch: '/guide/', link: '/guide/', text: 'Guide' },
          { activeMatch: '/api/', link: '/api/', text: 'API' },
          { items: [
            { link: 'https://github.com/saqqdy/git-unearth', text: 'GitHub' },
            { link: 'https://www.npmjs.com/package/git-unearth', text: 'NPM' },
          ], text: 'Links' },
        ],
        outline: { label: 'On this page' },
        sidebar: {
          '/api/': [
            { items: [{ link: '/api/', text: 'Overview' }], text: 'API Reference' },
            { collapsed: false, items: [
              { link: '/api/collect-blame', text: 'collectBlame()' },
              { link: '/api/collect-log', text: 'collectLog()' },
              { link: '/api/collect-diff', text: 'collectDiff()' },
              { link: '/api/collect-follow', text: 'collectFollow()' },
              { link: '/api/collect-commit-detail', text: 'collectCommitDetail()' },
              { link: '/api/create-cache-store', text: 'createCacheStore()' },
            ], text: 'Functions' },
            { collapsed: false, items: [
              { link: '/api/types/commit-info', text: 'CommitInfo' },
              { link: '/api/types/file-blame', text: 'FileBlame' },
              { link: '/api/types/file-diff', text: 'FileDiff' },
              { link: '/api/types/rename-history', text: 'RenameHistory' },
            ], text: 'Types' },
          ],
          '/guide/': [
            { items: [
              { link: '/guide/', text: 'Introduction' },
              { link: '/guide/installation', text: 'Installation' },
              { link: '/guide/quick-start', text: 'Quick Start' },
              { link: '/guide/roadmap', text: 'Roadmap' },
            ], text: 'Getting Started' },
            { items: [
              { link: '/guide/skill-commands', text: 'Skill Commands' },
              { link: '/guide/caching', text: 'Caching' },
            ], text: 'Features' },
          ],
        },
      },
      title: 'Git Unearth',
    },
    zh: {
      description: 'AI 驱动的 git blame 增强版 — 理解代码为什么写成这样',
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        darkModeSwitchLabel: '主题',
        docFooter: { next: '下一页', prev: '上一页' },
        editLink: {
          pattern: 'https://github.com/saqqdy/git-unearth/edit/master/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: { copyright: '版权所有 © 2024-present saqqdy', message: '基于 MIT 许可发布' },
        lastUpdated: { text: '最后更新' },
        nav: [
          { activeMatch: '/zh/guide/', link: '/zh/guide/', text: '指南' },
          { activeMatch: '/zh/api/', link: '/zh/api/', text: 'API' },
          { items: [
            { link: 'https://github.com/saqqdy/git-unearth', text: 'GitHub' },
            { link: 'https://www.npmjs.com/package/git-unearth', text: 'NPM' },
          ], text: '链接' },
        ],
        outline: { label: '页面导航' },
        sidebar: {
          '/zh/api/': [
            { items: [{ link: '/zh/api/', text: '概览' }], text: 'API 参考' },
            { collapsed: false, items: [
              { link: '/zh/api/collect-blame', text: 'collectBlame()' },
              { link: '/zh/api/collect-log', text: 'collectLog()' },
              { link: '/zh/api/collect-diff', text: 'collectDiff()' },
              { link: '/zh/api/collect-follow', text: 'collectFollow()' },
              { link: '/zh/api/collect-commit-detail', text: 'collectCommitDetail()' },
              { link: '/zh/api/create-cache-store', text: 'createCacheStore()' },
            ], text: '函数' },
            { collapsed: false, items: [
              { link: '/zh/api/types/commit-info', text: 'CommitInfo' },
              { link: '/zh/api/types/file-blame', text: 'FileBlame' },
              { link: '/zh/api/types/file-diff', text: 'FileDiff' },
              { link: '/zh/api/types/rename-history', text: 'RenameHistory' },
            ], text: '类型' },
          ],
          '/zh/guide/': [
            { items: [
              { link: '/zh/guide/', text: '介绍' },
              { link: '/zh/guide/installation', text: '安装' },
              { link: '/zh/guide/quick-start', text: '快速上手' },
              { link: '/zh/guide/roadmap', text: '版本路线图' },
            ], text: '开始' },
            { items: [
              { link: '/zh/guide/skill-commands', text: 'Skill 命令' },
              { link: '/zh/guide/caching', text: '缓存' },
            ], text: '功能' },
          ],
        },
      },
      title: 'Git Unearth',
    },
  },
  sitemap: { hostname: 'https://saqqdy.github.io/git-unearth' },
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    siteTitle: 'Git Unearth',
    socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/git-unearth' }],
  },
})