<?php
// 设置正确的MIME类型
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

// 读取sitemap.xml文件内容
$sitemapContent = file_get_contents(__DIR__ . '/sitemap.xml');

// 输出内容
echo $sitemapContent;
?>
