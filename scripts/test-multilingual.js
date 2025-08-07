/**
 * 测试多语言功能
 * 验证URL参数语言切换是否正常工作
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试配置
const LANGUAGES = ['en', 'zh', 'ja', 'ar'];
const TEST_URLS = [
    '/',
    '/stats',
    '/search',
    '/category/fc',
    '/category/arcade'
];

console.log('🧪 Testing Multilingual URL Parameters...\n');

// 验证语言文件存在
function validateLanguageFiles() {
    console.log('📁 Checking language files...');
    const i18nDir = path.join(__dirname, '../src/i18n/locales');
    
    const expectedFiles = [
        'en-US.json',
        'zh-CN.json', 
        'ja-JP.json',
        'ar-AR.json'
    ];
    
    let allFilesExist = true;
    
    expectedFiles.forEach(file => {
        const filePath = path.join(i18nDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`  ✅ ${file} exists`);
            
            // 验证JSON格式
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);
                console.log(`  ✅ ${file} is valid JSON`);
            } catch (error) {
                console.log(`  ❌ ${file} has invalid JSON: ${error.message}`);
                allFilesExist = false;
            }
        } else {
            console.log(`  ❌ ${file} missing`);
            allFilesExist = false;
        }
    });
    
    return allFilesExist;
}

// 验证路由配置
function validateRouterConfig() {
    console.log('\n🛣️  Checking router configuration...');
    const routerPath = path.join(__dirname, '../src/router/index.js');
    
    if (fs.existsSync(routerPath)) {
        const content = fs.readFileSync(routerPath, 'utf8');
        
        // 检查是否有语言检测逻辑
        if (content.includes('to.query.lang')) {
            console.log('  ✅ Language query parameter detection found');
        } else {
            console.log('  ❌ Language query parameter detection missing');
            return false;
        }
        
        if (content.includes('setLanguage')) {
            console.log('  ✅ setLanguage function import found');
        } else {
            console.log('  ❌ setLanguage function import missing');
            return false;
        }
        
        return true;
    } else {
        console.log('  ❌ Router file missing');
        return false;
    }
}

// 验证i18n配置
function validateI18nConfig() {
    console.log('\n🌍 Checking i18n configuration...');
    const i18nPath = path.join(__dirname, '../src/i18n/index.js');
    
    if (fs.existsSync(i18nPath)) {
        const content = fs.readFileSync(i18nPath, 'utf8');
        
        // 检查关键功能
        const requiredFeatures = [
            { name: 'getLanguageFromURL', pattern: 'getLanguageFromURL' },
            { name: 'updateHreflangTags', pattern: 'updateHreflangTags' },
            { name: 'URL_LANG_MAP', pattern: 'URL_LANG_MAP' },
            { name: 'updateURLLanguageParam', pattern: 'updateURLLanguageParam' }
        ];
        
        let allFeaturesFound = true;
        
        requiredFeatures.forEach(feature => {
            if (content.includes(feature.pattern)) {
                console.log(`  ✅ ${feature.name} function found`);
            } else {
                console.log(`  ❌ ${feature.name} function missing`);
                allFeaturesFound = false;
            }
        });
        
        return allFeaturesFound;
    } else {
        console.log('  ❌ i18n config file missing');
        return false;
    }
}

// 生成测试URL示例
function generateTestURLs() {
    console.log('\n🔗 Generated test URLs:');
    console.log('Base URLs (English default):');
    
    TEST_URLS.forEach(url => {
        console.log(`  https://games.espressox.online${url}`);
    });
    
    console.log('\nLanguage-specific URLs:');
    LANGUAGES.slice(1).forEach(lang => { // Skip 'en' as it's default
        console.log(`\n  ${lang.toUpperCase()}:`);
        TEST_URLS.forEach(url => {
            const separator = url.includes('?') ? '&' : '?';
            console.log(`    https://games.espressox.online${url}${separator}lang=${lang}`);
        });
    });
}

// 验证hreflang标签会被正确生成
function validateHreflangGeneration() {
    console.log('\n🏷️  Checking hreflang tag generation...');
    
    // 检查main.js是否调用了updateHreflangTags
    const mainPath = path.join(__dirname, '../src/main.js');
    
    if (fs.existsSync(mainPath)) {
        const content = fs.readFileSync(mainPath, 'utf8');
        
        if (content.includes('updateHreflangTags')) {
            console.log('  ✅ updateHreflangTags called in main.js');
            return true;
        } else {
            console.log('  ❌ updateHreflangTags not called in main.js');
            return false;
        }
    } else {
        console.log('  ❌ main.js file missing');
        return false;
    }
}

// 主测试函数
function runTests() {
    console.log('🚀 Starting multilingual functionality tests...\n');
    
    const tests = [
        { name: 'Language Files', test: validateLanguageFiles },
        { name: 'Router Config', test: validateRouterConfig },
        { name: 'i18n Config', test: validateI18nConfig },
        { name: 'Hreflang Generation', test: validateHreflangGeneration }
    ];
    
    let passedTests = 0;
    
    tests.forEach(({ name, test }) => {
        console.log(`\n📋 Testing: ${name}`);
        console.log('─'.repeat(50));
        
        if (test()) {
            console.log(`✅ ${name} - PASSED`);
            passedTests++;
        } else {
            console.log(`❌ ${name} - FAILED`);
        }
    });
    
    // 生成测试URL示例
    generateTestURLs();
    
    // 总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Tests passed: ${passedTests}/${tests.length}`);
    console.log(`Success rate: ${Math.round(passedTests/tests.length * 100)}%`);
    
    if (passedTests === tests.length) {
        console.log('\n🎉 All tests PASSED! Multilingual functionality is ready!');
        console.log('\n📋 Manual testing checklist:');
        console.log('  1. Visit https://games.espressox.online/?lang=zh');
        console.log('  2. Check if interface switches to Chinese');
        console.log('  3. Check browser dev tools for hreflang tags');
        console.log('  4. Test language switching with URL parameters');
        console.log('  5. Verify localStorage persistence');
    } else {
        console.log('\n⚠️  Some tests FAILED. Please check the issues above.');
    }
    
    return passedTests === tests.length;
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests };