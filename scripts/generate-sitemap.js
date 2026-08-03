import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');
const DIST_DIR = path.join(__dirname, '../dist');

const getSlugs = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''));
};

const blogs = getSlugs(path.join(CONTENT_DIR, 'blog'));
const services = getSlugs(path.join(CONTENT_DIR, 'services'));
const locations = getSlugs(path.join(CONTENT_DIR, 'locations'));
const caseStudies = getSlugs(path.join(CONTENT_DIR, 'case-studies'));

const baseUrl = 'https://dhruvikvanol.com';
const date = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Blogs
blogs.forEach(slug => {
  sitemap += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Services
services.forEach(slug => {
  sitemap += `
  <url>
    <loc>${baseUrl}/services/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Locations
locations.forEach(slug => {
  sitemap += `
  <url>
    <loc>${baseUrl}/location/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

// Case Studies
caseStudies.forEach(slug => {
  sitemap += `
  <url>
    <loc>${baseUrl}/case-studies/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

sitemap += `
</urlset>`;

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
console.log('✅ Generated sitemap.xml with', 2 + blogs.length + services.length + locations.length + caseStudies.length, 'URLs');
