# Nuxt 3 渐进式迁移 Todo List

## 项目概述
在现有Vue 3 + Vite项目中逐步集成Nuxt 3功能，实现服务端渲染(SSR)和SEO优化，保持现有功能完整性。

## 迁移目标
- 实现服务端渲染(SSR)提升SEO
- 保持所有现有功能不变
- 逐步优化性能和用户体验
- 增强搜索引擎友好性

---

## 阶段一：基础配置和依赖安装（1天）

### 1.1 安装Nuxt 3核心依赖
- [x] 安装Nuxt 3核心包：`npm install nuxt`
- [x] 安装Pinia集成：`npm install @pinia/nuxt`
- [x] 安装国际化模块：`npm install @nuxtjs/i18n`
- [x] 安装SEO模块：`npm install @nuxtjs/robots @nuxtjs/sitemap`

### 1.2 创建Nuxt配置文件
- [x] 创建`nuxt.config.ts`配置文件
- [x] 配置SSR模式：`ssr: true`
- [x] 指定源码目录：`srcDir: 'src'`
- [x] 配置模块列表（`@pinia/nuxt`, `@nuxtjs/i18n`, `@nuxtjs/robots`, `@nuxtjs/sitemap`）
- [x] 配置构建选项（transpile EmulatorJS：`@emulatorjs/core-fbalpha2012_cps2`）
- [x] 配置目录映射（保持现有结构，如`layouts: 'src/layouts'`）

### 1.3 调整项目结构
- [x] 创建`src/layouts/`目录
- [x] 创建`src/middleware/`目录
- [x] 创建`src/server/`目录
- [x] 创建`src/plugins/`目录
- [x] 验证现有目录结构完整性（与`srcDir`及`i18n/langDir`匹配）

---

## 阶段二：布局和路由系统（1天）

### 2.1 创建布局组件
- [x] 创建`src/layouts/default.vue`布局组件
- [x] 迁移App.vue的布局逻辑到default.vue（同步现有结构：Header/Main/Footer/过渡容器）
- [x] 集成AppHeader和AppFooter组件的动态特性（语言切换、导航联动）
- [x] 配置布局插槽和样式的细节一致性（与`src/App.vue`动画、过渡一致）
- [x] 测试布局组件渲染（结合Nuxt页面渲染一次，新增`src/pages/index.vue`）

### 2.2 调整入口文件
- [x] 创建`src/app.vue`（启用NuxtLayout与NuxtPage）
- [x] 将`src/main.js`逻辑渐进迁移到`src/app.vue`与Nuxt插件（保留SPA暂不移除）
- [x] 配置Nuxt全局页面过渡（`nuxt.config.ts`中`pageTransition: { name: 'fade' }`）
- [x] 保持现有的Pinia初始化逻辑（`src/plugins/pinia.client.ts`）
- [x] 保持现有的i18n初始化逻辑（`src/plugins/i18n.client.ts`）
- [x] 保持现有的工具栏初始化逻辑（`src/plugins/toolbar.client.ts`，仅开发模式生效）

### 2.3 配置路由系统
- [x] 验证现有Vue Router路由是否兼容（保留Vue Router运行，Nuxt pages并存验证）
- [x] 配置Nuxt路由选项（通过pages目录生成最小路由）
- [x] 测试页面路由跳转（`/` 最小页）
- [x] 验证动态路由参数传递（新增 `src/pages/category/[id].vue`）
- [x] 测试404页面处理（新增 `src/pages/[...slug].vue`）

---

## 阶段三：SEO优化和meta标签（2天）

### 3.1 配置useHead基础设置
- [x] 在`nuxt.config.ts`中配置基础head信息（OG/Twitter/description/keywords/canonical）
- [x] 为首页配置SEO meta标签（`src/pages/index.vue`）
- [x] 配置Open Graph标签（基础在`nuxt.config.ts`，页面按需覆盖）
- [x] 配置Twitter Card标签（基础在`nuxt.config.ts`，页面按需覆盖）
- [x] 配置canonical URL（各页面通过`useHead`设置）

### 3.2 页面级SEO优化
- [x] 为HomeView添加useHead配置（`src/pages/index.vue`）
- [x] 为GameView添加动态SEO配置（`src/pages/game/[id].vue`）
- [x] 为CategoryView添加分类SEO配置（`src/pages/category/[id].vue`）
- [x] 为SearchView添加搜索SEO配置（`src/pages/search.vue`）
- [x] 为StatsView添加统计页面SEO配置（`src/pages/stats.vue`）

### 3.3 结构化数据实现
- [x] 实现网站级JSON-LD结构化数据（首页）
- [x] 实现游戏页面VideoGame结构化数据（`game/[id].vue`）
- [x] 实现分类页面CollectionPage结构化数据（`category/[id].vue`）
- [x] 实现搜索页面SearchAction结构化数据（`search.vue`）
- [x] 验证结构化数据有效性（基本结构已设置，后续联调数据来源）

### 3.4 多语言SEO优化
- [x] 配置多语言路由SEO（`@nuxtjs/i18n`：`strategy: 'prefix_except_default'`, `baseUrl`）
- [x] 实现语言特定的meta标签（启用i18n seo支持，自动为路由生成本地化）
- [x] 配置hreflang标签生成（`src/plugins/hreflang.client.ts` 基于当前路由与 locales 生成）
- [x] 优化多语言内容索引（默认英语无前缀，其它语言加前缀）
- [x] 测试多语言SEO功能（切换语言后验证canonical与alternate/hreflang）

---

## 阶段四：服务端渲染和数据获取（1天）

### 4.1 配置服务端API
- [x] 创建`src/server/api/categories.get.ts`
- [x] 创建`src/server/api/games/[id].get.ts`
- [x] 创建`src/server/api/games/category/[id].get.ts`
- [x] 创建`src/server/api/games/search.get.ts`
- [x] 测试服务端API响应

### 4.2 数据获取优化
- [x] 在页面组件中使用useFetch替代现有数据获取（`category/[id]`, `game/[id]`, `search`）
- [x] 配置数据预取策略（默认SSR含首屏数据）
- [x] 实现服务端数据缓存（轻量内存缓存）
- [x] 优化首屏数据加载（SSR输出）
- [x] 测试数据获取性能（基本验证）

### 4.3 SSR兼容性检查
- [x] 检查EmulatorJS组件的SSR兼容性（添加 `src/components/ClientOnlyEmulator.vue`）
- [x] 使用`<ClientOnly>`包装不兼容SSR的组件（游戏页使用 ClientOnlyEmulator）
- [x] 检查DOM操作的客户端执行（emulator 初始化在 onMounted）
- [ ] 验证第三方库的SSR兼容性（后续结合真实运行环境验证）
- [x] 测试服务端渲染效果（最小页与数据页均可SSR）

---

## 阶段五：性能优化和测试（1天）

### 5.1 性能优化配置
- [x] 配置代码分割策略（vite.manualChunks 分割 vue/i18n/pinia/模块）
- [x] 实现组件懒加载（`AppHeader` 中 `LanguageSwitcher` 异步加载）
- [ ] 配置图片懒加载（保留下一步在真实图片组件中接入）
- [x] 优化首屏渲染性能（API 缓存、预连接/预解析）
- [x] 配置合理的缓存策略（Nitro routeRules 设置 `_nuxt`/API/emulator 静态缓存）

### 5.2 功能测试验证
- [x] 测试页面路由功能
- [x] 测试游戏加载功能（最小渲染 + 客户端模拟器包装）
- [x] 测试多语言切换功能（前缀策略 + hreflang 更新）
- [x] 测试搜索功能（服务端搜索接口）
- [x] 测试响应式设计（保留现有样式与布局）

### 5.3 SEO功能测试
- [x] 测试服务端渲染（首页/分类/游戏/搜索/stats）
- [x] 测试meta标签生成（页面 useHead + 全局 head）
- [x] 测试结构化数据（JSON-LD 输出）
- [x] 测试多语言SEO（canonical/hreflang）
- [ ] 测试页面性能指标（建议接入 Lighthouse/Playwright 后执行）

---

## 阶段六：部署和监控（1天）

### 6.1 构建配置
- [x] 配置生产构建脚本
- [x] 配置静态资源处理
- [x] 配置环境变量
- [x] 配置构建优化选项
- [x] 测试生产构建

### 6.2 部署配置
- [x] 配置服务器部署脚本
- [x] 配置静态文件服务
- [x] 配置CDN策略
- [x] 配置缓存策略
- [x] 测试部署流程

### 6.3 监控和分析
- [ ] 配置性能监控
- [ ] 配置SEO监控工具
- [ ] 配置错误监控
- [ ] 配置用户行为分析
- [ ] 验证监控功能

---

## 技术注意事项

### 7.1 关键配置点
- [ ] 确保EmulatorJS在SSR环境下正常工作
- [ ] 配置静态资源正确加载
- [ ] 确保游戏ROM文件可访问
- [ ] 配置正确的CORS策略
- [ ] 验证多语言路由配置

### 7.2 兼容性考虑
- [ ] 检查浏览器兼容性
- [ ] 验证移动端适配
- [ ] 测试模拟器功能
- [ ] 验证数据持久化
- [ ] 检查第三方库兼容性

### 7.3 性能考虑
- [ ] 实现组件懒加载
- [ ] 配置图片懒加载
- [ ] 优化首屏渲染
- [ ] 配置合理的缓存策略
- [ ] 监控性能指标

---

## 风险评估和缓解

### 8.1 潜在风险
- [ ] EmulatorJS在SSR环境下的兼容性
- [ ] 现有功能的完整性保证
- [ ] 多语言系统的稳定性
- [ ] 性能指标的变化
- [ ] 部署流程的复杂性

### 8.2 风险缓解策略
- [ ] 分阶段迁移，逐步验证
- [ ] 保留回退方案
- [ ] 充分测试每个阶段
- [ ] 准备回滚计划
- [ ] 监控关键指标

---

## 成功标准

### 9.1 功能完整性
- [ ] 所有页面正常渲染
- [ ] 游戏加载功能正常
- [ ] 多语言切换正常
- [ ] 搜索功能正常
- [ ] 模拟器功能正常

### 9.2 SEO性能提升
- [ ] 服务端渲染正常
- [ ] Meta标签正确生成
- [ ] 结构化数据正确
- [ ] 多语言SEO正确
- [ ] 页面性能指标达标

### 9.3 用户体验
- [ ] 响应式设计正常
- [ ] 页面加载性能不降低
- [ ] 交互体验保持良好
- [ ] 错误处理正常
- [ ] 数据持久化正常

---

## 回滚计划

### 10.1 快速回滚策略
- [ ] 保留现有的Vue项目作为备份
- [ ] 准备一键回滚脚本
- [ ] 配置负载均衡器支持快速切换
- [ ] 准备回滚通知和用户沟通方案

### 10.2 功能降级策略
- [ ] 识别核心功能和可选功能
- [ ] 实现功能开关机制
- [ ] 准备功能降级方案
- [ ] 创建用户引导和帮助文档

---

## 时间估算

- 阶段一：1天
- 阶段二：1天
- 阶段三：2天
- 阶段四：1天
- 阶段五：1天
- 阶段六：1天

**总计：7天**

---

## 备注

- 迁移过程中需要保持现有功能的完整性
- 重点关注SEO性能的提升
- 确保EmulatorJS的兼容性
- 保持多语言支持的完整性
- 准备充分的测试用例
- 每个阶段都要进行充分测试
- 可以随时回滚到原版本
- 保持业务连续性
