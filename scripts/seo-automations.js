import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');
const CONTENT_DIR = path.join(__dirname, '../src/content');

const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');

// 1. Soft 404 & Duplicate Content Detection
function analyzeContent() {
  console.log('🔍 Analyzing Content for SEO Health...');
  const allContent = [];
  const titles = new Set();
  
  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const titleMatch = content.match(/title:\s*"(.*?)"/);
        
        if (titleMatch) {
          const title = titleMatch[1];
          if (titles.has(title)) {
            console.warn(`⚠️ DUPLICATE CONTENT DETECTED: Title "${title}" in ${file}`);
          }
          titles.add(title);
        }
        
        // Soft 404 detection (Content too thin)
        if (content.length < 300) {
           console.warn(`⚠️ SOFT 404 RISK (Thin Content): ${file} is under 300 characters.`);
        }
      }
    });
  }
  
  scanDir(CONTENT_DIR);
  console.log(`✅ Content Analysis Complete. Scanned ${titles.size} unique titles.`);
}

// 2. Automated Sitemap Ping (IndexNow & Google)
function pingSearchEngines() {
  const sitemapUrl = 'https://dhruvikvanol.com/sitemap.xml';
  
  console.log(`🚀 Pinging Search Engines with Sitemap: ${sitemapUrl}`);
  
  // Google Ping
  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  https.get(googlePing, (res) => {
    console.log(`✅ Google Ping Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`❌ Google Ping Failed: ${e.message}`);
  });
  
  // IndexNow Ping (Bing, Yandex, etc.)
  // Requires an IndexNow Key hosted at root, assuming key is 'dhruvik-seo-key'
  const indexNowData = JSON.stringify({
    host: "dhruvikvanol.com",
    key: "dhruvik-seo-key",
    keyLocation: "https://dhruvikvanol.com/dhruvik-seo-key.txt",
    urlList: [
      "https://dhruvikvanol.com/blog",
      "https://dhruvikvanol.com/"
    ]
  });

  const indexNowReq = https.request({
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': indexNowData.length
    }
  }, (res) => {
    console.log(`✅ IndexNow Ping Status: ${res.statusCode}`);
  });
  
  indexNowReq.on('error', (e) => {
    console.error(`❌ IndexNow Ping Failed: ${e.message}`);
  });
  
  indexNowReq.write(indexNowData);
  indexNowReq.end();
}

console.log('=============================================');
console.log('🤖 ENTERPRISE SEO AUTOMATION SUITE');
console.log('=============================================');
analyzeContent();

if (fs.existsSync(sitemapPath)) {
  pingSearchEngines();
} else {
  console.log('⚠️ sitemap.xml not found in dist. Run build & sitemap generator first.');
}
