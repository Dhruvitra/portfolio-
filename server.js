import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security Headers (Helmet)
// We configure Content Security Policy (CSP) loosely to allow inline scripts/styles often needed by Vite builds,
// but strict enough to pass baseline security scans.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://connect.facebook.net", "https://www.clarity.ms"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*"],
        connectSrc: ["'self'", "https://*", "wss://*"],
      },
    },
  })
);

// Gzip & Brotli Compression for Performance / Core Web Vitals
app.use(compression());

// Serve static assets from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Dynamic SEO Endpoints

// 1. Robots.txt
app.get('/robots.txt', (req, res) => {
  const domain = req.protocol + '://' + req.get('host');
  const robotsText = `User-agent: *
Allow: /
Disallow: /adminpanel
Disallow: /adminpanal
Disallow: /api/

Sitemap: ${domain}/sitemap.xml`;
  res.type('text/plain');
  res.send(robotsText);
});

// 2. Dynamic XML Sitemap
app.get('/sitemap.xml', (req, res) => {
  const domain = req.protocol + '://' + req.get('host');
  const today = new Date().toISOString();
  
  // Static Routes
  const urls = [
    { loc: `${domain}/`, changefreq: 'weekly', priority: '1.0' }
  ];

  // Note: If you have dynamic case studies (e.g. stored in Firebase or a local JSON file), 
  // you would fetch them here and push to the urls array.
  // Example: 
  // const caseStudies = [{ id: 'shopify-migration' }];
  // caseStudies.forEach(study => urls.push({ loc: `${domain}/case-study/${study.id}`, changefreq: 'monthly', priority: '0.8' }));

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>`;
  
  res.type('application/xml');
  res.send(xml);
});

// Fallback all requests to index.html for Single Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
