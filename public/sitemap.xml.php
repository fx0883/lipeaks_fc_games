<?php
// 设置正确的MIME类型和编码
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
header('Access-Control-Allow-Origin: *');

// 禁用错误显示（生产环境）
error_reporting(0);
ini_set('display_errors', 0);

try {
    // 读取sitemap.xml文件内容
    $sitemapPath = __DIR__ . '/sitemap.xml';
    
    if (file_exists($sitemapPath)) {
        $sitemapContent = file_get_contents($sitemapPath);
        if ($sitemapContent !== false) {
            echo $sitemapContent;
            exit;
        }
    }
    
    // 如果文件不存在或读取失败，生成一个基本的sitemap
    $currentDate = date('Y-m-d');
    echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://games.espressox.online/</loc>
    <lastmod>' . $currentDate . '</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://games.espressox.online/stats</loc>
    <lastmod>' . $currentDate . '</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://games.espressox.online/search</loc>
    <lastmod>' . $currentDate . '</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>';
    
} catch (Exception $e) {
    // 如果出现异常，生成基本的sitemap
    $currentDate = date('Y-m-d');
    echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://games.espressox.online/</loc>
    <lastmod>' . $currentDate . '</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>';
}
?>
