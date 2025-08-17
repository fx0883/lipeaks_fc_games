import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
    // 添加静态文件路由处理
    fs: {
      // 允许访问public目录外的文件
      allow: ['..']
    }
  },
  // 添加静态文件处理规则
  publicDir: 'public',
  // 确保sitemap.xml等文件不被Vue应用拦截
  build: {
    // 确保构建产物包含SPA路由回退配置
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // 更细粒度的代码分割
        manualChunks: {
          // 核心框架库
          'vue-core': ['vue', 'vue-router'],
          // 状态管理和国际化
          'app-features': ['pinia', 'vue-i18n'],
          // 游戏相关功能（如果有大型库）
          'emulator': [], // 可以根据需要添加模拟器相关库
          // 工具库
          'utils': [], // 可以根据需要添加工具库
        },
        // 优化资源文件名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.vue', '') : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置资源内联阈值
    assetsInlineLimit: 4096,
    // 启用 sourcemap 在开发时（生产时可关闭）
    sourcemap: false,
  }
})
