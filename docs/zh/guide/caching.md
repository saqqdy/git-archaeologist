# 缓存

Git Archaeologist 支持三层缓存：

1. **Session 缓存** — 内存 Map，快速但短暂
2. **文件系统缓存** — 持久化到 `.git-archaeologist/` 目录
3. **无缓存** — 每次都重新执行 git 命令

## 使用

```typescript
import { createCacheStore, collectBlame } from 'git-archaeologist'

const cache = createCacheStore({
  sessionCache: true,
  fsCache: true,
  cacheDir: '.git-archaeologist',
  defaultTTL: 3600, // 1 小时
})

// 第一次调用：缓存未命中
const blame1 = await collectBlame({ root, file: 'src/index.ts', cache })

// 第二次调用：缓存命中（10 倍加速）
const blame2 = await collectBlame({ root, file: 'src/index.ts', cache })
```

## 缓存操作

```typescript
cache.has(key)    // 检查是否存在
cache.get(key)    // 获取值
cache.set(key, value, ttl)  // 存储并可选 TTL
cache.delete(key) // 删除条目
cache.clear()     // 清空全部
```
