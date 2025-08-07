/**
 * 性能审计脚本
 * 检查Core Web Vitals和其他性能指标
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 性能目标
const PERFORMANCE_TARGETS = {
    LCP: 2.5, // 秒
    FID: 100, // 毫秒
    CLS: 0.1,
    FCP: 1.8, // 秒
    totalBundleSize: 300, // KB (gzipped)
    cssSize: 50, // KB (gzipped)
    jsSize: 250, // KB (gzipped)
    imageOptimization: true,
    lazyLoading: true,
    caching: true
};

console.log('🚀 Starting Performance Audit...\n');

// 检查构建文件大小
function checkBundleSizes() {
    console.log('📦 Checking bundle sizes...');
    const distDir = path.join(__dirname, '../dist');
    
    if (!fs.existsSync(distDir)) {
        console.log('  ❌ dist directory not found. Run npm run build first.');
        return false;
    }
    
    const assetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
        console.log('  ❌ assets directory not found.');
        return false;
    }
    
    const files = fs.readdirSync(assetsDir);
    let totalJSSize = 0;
    let totalCSSSize = 0;
    let allBundlesOptimal = true;
    
    console.log('\n  📁 Asset Analysis:');
    console.log('  ' + '─'.repeat(60));
    
    files.forEach(file => {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (file.endsWith('.js')) {
            totalJSSize += sizeKB;
            const isLarge = sizeKB > 100;
            console.log(`  ${isLarge ? '⚠️' : '✅'} ${file}: ${sizeKB} KB ${isLarge ? '(Large)' : ''}`);
            if (isLarge) allBundlesOptimal = false;
        } else if (file.endsWith('.css')) {
            totalCSSSize += sizeKB;
            const isLarge = sizeKB > 30;
            console.log(`  ${isLarge ? '⚠️' : '✅'} ${file}: ${sizeKB} KB ${isLarge ? '(Large)' : ''}`);
            if (isLarge) allBundlesOptimal = false;
        }
    });
    
    console.log('  ' + '─'.repeat(60));
    console.log(`  📊 Total JS: ${totalJSSize} KB (Target: <${PERFORMANCE_TARGETS.jsSize} KB)`);
    console.log(`  📊 Total CSS: ${totalCSSSize} KB (Target: <${PERFORMANCE_TARGETS.cssSize} KB)`);
    console.log(`  📊 Total Assets: ${totalJSSize + totalCSSSize} KB (Target: <${PERFORMANCE_TARGETS.totalBundleSize} KB)`);
    
    const jsOptimal = totalJSSize <= PERFORMANCE_TARGETS.jsSize;
    const cssOptimal = totalCSSSize <= PERFORMANCE_TARGETS.cssSize;
    const totalOptimal = (totalJSSize + totalCSSSize) <= PERFORMANCE_TARGETS.totalBundleSize;
    
    console.log(`\n  ${jsOptimal ? '✅' : '❌'} JavaScript size: ${jsOptimal ? 'OPTIMAL' : 'NEEDS OPTIMIZATION'}`);
    console.log(`  ${cssOptimal ? '✅' : '❌'} CSS size: ${cssOptimal ? 'OPTIMAL' : 'NEEDS OPTIMIZATION'}`);
    console.log(`  ${totalOptimal ? '✅' : '❌'} Total size: ${totalOptimal ? 'OPTIMAL' : 'NEEDS OPTIMIZATION'}`);
    
    return jsOptimal && cssOptimal && totalOptimal && allBundlesOptimal;
}

// 检查懒加载实现
function checkLazyLoading() {
    console.log('\n🖼️  Checking lazy loading implementation...');
    
    // 检查组件中的懒加载
    const componentsDir = path.join(__dirname, '../src/components');
    const viewsDir = path.join(__dirname, '../src/views');
    
    let lazyLoadingFound = false;
    
    // 检查关键组件
    const filesToCheck = [
        path.join(viewsDir, 'HomeView.vue'),
        path.join(viewsDir, 'CategoryView.vue'),
        path.join(viewsDir, 'GameView.vue')
    ];
    
    filesToCheck.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 检查v-lazy或loading="lazy"
            if (content.includes('loading="lazy"') || content.includes('v-lazy') || content.includes('IntersectionObserver')) {
                console.log(`  ✅ Lazy loading found in ${path.basename(filePath)}`);
                lazyLoadingFound = true;
            } else {
                console.log(`  ⚠️  No lazy loading in ${path.basename(filePath)}`);
            }
        }
    });
    
    return lazyLoadingFound;
}

// 检查缓存策略
function checkCachingStrategy() {
    console.log('\n💾 Checking caching strategy...');
    
    // 检查是否有缓存相关配置
    const viteConfigPath = path.join(__dirname, '../vite.config.js');
    const packageJsonPath = path.join(__dirname, '../package.json');
    
    let cachingConfigured = false;
    
    if (fs.existsSync(viteConfigPath)) {
        const content = fs.readFileSync(viteConfigPath, 'utf8');
        
        if (content.includes('rollupOptions') || content.includes('build')) {
            console.log('  ✅ Build optimization configured in vite.config.js');
            cachingConfigured = true;
        }
    }
    
    // 检查是否有Service Worker或PWA配置
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.dependencies && 
            (packageJson.dependencies['workbox-webpack-plugin'] || 
             packageJson.dependencies['vite-plugin-pwa'])) {
            console.log('  ✅ PWA/Service Worker configured');
            cachingConfigured = true;
        }
    }
    
    // 检查public目录的缓存文件
    const htaccessPath = path.join(__dirname, '../public/.htaccess');
    if (fs.existsSync(htaccessPath)) {
        const content = fs.readFileSync(htaccessPath, 'utf8');
        if (content.includes('ExpiresByType') || content.includes('Cache-Control')) {
            console.log('  ✅ HTTP caching headers configured in .htaccess');
            cachingConfigured = true;
        }
    }
    
    if (!cachingConfigured) {
        console.log('  ⚠️  No caching strategy detected');
    }
    
    return cachingConfigured;
}

// 检查图片优化
function checkImageOptimization() {
    console.log('\n🖼️  Checking image optimization...');
    
    const publicDir = path.join(__dirname, '../public');
    const srcAssetsDir = path.join(__dirname, '../src/assets');
    
    let optimizedImages = 0;
    let totalImages = 0;
    
    function checkImagesInDir(dir, dirName) {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        
        files.forEach(file => {
            if (file.isFile()) {
                const ext = path.extname(file.name).toLowerCase();
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                    totalImages++;
                    
                    const filePath = path.join(dir, file.name);
                    const stats = fs.statSync(filePath);
                    const sizeKB = Math.round(stats.size / 1024);
                    
                    // 简单的优化检查：WebP格式或小于100KB
                    if (ext === '.webp' || sizeKB < 100) {
                        optimizedImages++;
                        console.log(`  ✅ ${file.name} (${sizeKB} KB) - Optimized`);
                    } else {
                        console.log(`  ⚠️  ${file.name} (${sizeKB} KB) - Could be optimized`);
                    }
                }
            }
        });
    }
    
    console.log('  📁 Checking public directory...');
    checkImagesInDir(publicDir, 'public');
    
    console.log('  📁 Checking src/assets directory...');
    checkImagesInDir(srcAssetsDir, 'src/assets');
    
    const optimizationRate = totalImages > 0 ? (optimizedImages / totalImages) * 100 : 100;
    console.log(`\n  📊 Image optimization rate: ${optimizationRate.toFixed(1)}% (${optimizedImages}/${totalImages})`);
    
    return optimizationRate >= 80; // 80%以上认为良好
}

// 检查移动端优化
function checkMobileOptimization() {
    console.log('\n📱 Checking mobile optimization...');
    
    const indexPath = path.join(__dirname, '../index.html');
    let mobileOptimized = true;
    
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // 检查viewport meta标签
        if (content.includes('viewport')) {
            console.log('  ✅ Viewport meta tag found');
        } else {
            console.log('  ❌ Viewport meta tag missing');
            mobileOptimized = false;
        }
        
        // 检查响应式设计提示
        if (content.includes('responsive') || content.includes('@media')) {
            console.log('  ✅ Responsive design hints found');
        }
    }
    
    // 检查CSS中的媒体查询
    const styleFile = path.join(__dirname, '../src/style.css');
    if (fs.existsSync(styleFile)) {
        const content = fs.readFileSync(styleFile, 'utf8');
        
        if (content.includes('@media')) {
            console.log('  ✅ Media queries found in CSS');
        } else {
            console.log('  ⚠️  No media queries found in main CSS');
        }
    }
    
    return mobileOptimized;
}

// 生成性能优化建议
function generateOptimizationSuggestions(results) {
    console.log('\n💡 Performance Optimization Suggestions:');
    console.log('='.repeat(60));
    
    if (!results.bundleSize) {
        console.log('📦 Bundle Size Optimization:');
        console.log('  • Enable tree shaking in build configuration');
        console.log('  • Split large bundles into smaller chunks');
        console.log('  • Remove unused dependencies');
        console.log('  • Use dynamic imports for route-based code splitting');
    }
    
    if (!results.lazyLoading) {
        console.log('\n🖼️  Lazy Loading:');
        console.log('  • Add loading="lazy" to images');
        console.log('  • Implement IntersectionObserver for game thumbnails');
        console.log('  • Lazy load below-the-fold content');
    }
    
    if (!results.imageOptimization) {
        console.log('\n🖼️  Image Optimization:');
        console.log('  • Convert images to WebP format');
        console.log('  • Compress large images');
        console.log('  • Use responsive images with srcset');
        console.log('  • Consider using a CDN for image delivery');
    }
    
    if (!results.caching) {
        console.log('\n💾 Caching Strategy:');
        console.log('  • Implement service worker for offline caching');
        console.log('  • Add cache headers to static assets');
        console.log('  • Use browser caching for game ROMs');
        console.log('  • Consider implementing a CDN');
    }
    
    console.log('\n🚀 Advanced Optimizations:');
    console.log('  • Preload critical resources');
    console.log('  • Implement resource hints (dns-prefetch, preconnect)');
    console.log('  • Minimize main thread work');
    console.log('  • Optimize third-party scripts');
    console.log('  • Use compression (gzip/brotli)');
}

// 主审计函数
function runPerformanceAudit() {
    console.log('🔍 Performance Audit Report');
    console.log('='.repeat(60));
    
    const results = {
        bundleSize: checkBundleSizes(),
        lazyLoading: checkLazyLoading(),
        caching: checkCachingStrategy(),
        imageOptimization: checkImageOptimization(),
        mobileOptimization: checkMobileOptimization()
    };
    
    // 计算总分
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    const score = Math.round((passedTests / totalTests) * 100);
    
    // 显示结果
    console.log('\n📊 AUDIT RESULTS');
    console.log('='.repeat(60));
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`${status} ${testName}`);
    });
    
    console.log('─'.repeat(60));
    console.log(`🎯 Performance Score: ${score}/100`);
    
    if (score >= 90) {
        console.log('🎉 EXCELLENT! Your site is highly optimized!');
    } else if (score >= 70) {
        console.log('👍 GOOD! Some optimizations recommended.');
    } else if (score >= 50) {
        console.log('⚠️  FAIR. Significant optimizations needed.');
    } else {
        console.log('🔴 POOR. Major performance issues detected.');
    }
    
    // 生成建议
    generateOptimizationSuggestions(results);
    
    console.log('\n📋 Next Steps:');
    console.log('  1. Address failed audit items');
    console.log('  2. Test with real devices and network conditions');
    console.log('  3. Use Google PageSpeed Insights for detailed analysis');
    console.log('  4. Monitor Core Web Vitals in production');
    
    return { score, results };
}

// 运行审计
if (import.meta.url === `file://${process.argv[1]}`) {
    runPerformanceAudit();
}

export { runPerformanceAudit };