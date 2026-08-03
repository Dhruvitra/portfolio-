import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const SERVICES_DIR = path.join(CONTENT_DIR, 'services');
const LOCATIONS_DIR = path.join(CONTENT_DIR, 'locations');
const CASE_STUDIES_DIR = path.join(CONTENT_DIR, 'case-studies');
const AUTHORITY_PAGES_DIR = path.join(CONTENT_DIR, 'authority');

[CONTENT_DIR, BLOG_DIR, SERVICES_DIR, LOCATIONS_DIR, CASE_STUDIES_DIR, AUTHORITY_PAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           
  .replace(/[^\w\-]+/g, '')       
  .replace(/\-\-+/g, '-')         
  .replace(/^-+/, '')             
  .replace(/-+$/, '');            

function generateMarkdown(dir, slug, title, category, typeLabel) {
  const content = `---
title: "${title}"
description: "Comprehensive ${typeLabel.toLowerCase()} on ${title}. Optimized for AI Search, LLMs, and enterprise developers in 2026."
author: "Dhruvik Vanol"
date: "2026-08-01"
category: "${category}"
tags: ["${category}", "SEO", "Web Development", "Enterprise", "${typeLabel}"]
readingTime: "8 min read"
---

# ${title}

Welcome to this definitive **${typeLabel}**. In the modern era of AI search (ChatGPT, Perplexity, Gemini) and Google AI Overviews, having structured, semantic content is critical.

## 🎯 Executive Summary
- **Core Concept**: Understanding ${title}.
- **Primary Benefit**: Scalability, maintainability, and 100/100 Core Web Vitals.
- **Target Audience**: Enterprise architects and Senior Full Stack Engineers.

## 🧠 Deep Dive and Semantic Entities
To rank well in LLMs, we must establish clear entity relationships.
This ${typeLabel.toLowerCase()} covers:
1. Architectural patterns
2. Build pipeline optimizations
3. Server-side rendering techniques

## ❓ Frequently Asked Questions (FAQ)
**Q: Why is this important in 2026?**
A: Search engines now rely on vector embeddings and RAG pipelines. Structuring content semantically ensures your brand is the chosen entity in an AI Overview.

**Q: Does this improve Core Web Vitals?**
A: Yes. By adopting these architectural standards, LCP and CLS are mathematically minimized.

## 🔗 Related Resources
- [Back to Blog](/blog)
- [View our Services](/services)
`;
  fs.writeFileSync(path.join(dir, `${slug}.md`), content);
}

// Phase 15: 100 Articles, 50 Tutorials, 50 Comparisons, 30 Guides, 20 Glossaries, 20 Resources
console.log('Generating Phase 15 Topical Authority Content...');

const categories = ["React", "Next.js", "Node.js", "Shopify", "AI Automation", "MERN Stack", "SEO", "Performance", "Enterprise", "TypeScript"];

// 100 Articles
for(let i=1; i<=100; i++) {
  generateMarkdown(BLOG_DIR, `article-${i}`, `Advanced Strategy ${i} for Modern Web`, categories[i % 10], "Article");
}

// 50 Tutorials
for(let i=1; i<=50; i++) {
  generateMarkdown(BLOG_DIR, `tutorial-${i}`, `How to Build Scalable System ${i}`, categories[i % 10], "Tutorial");
}

// 50 Comparisons
for(let i=1; i<=50; i++) {
  generateMarkdown(BLOG_DIR, `comparison-${i}`, `Technology A vs Technology B - Case ${i}`, categories[i % 10], "Comparison");
}

// 30 Guides
for(let i=1; i<=30; i++) {
  generateMarkdown(BLOG_DIR, `guide-${i}`, `The Ultimate Guide to Tech ${i}`, categories[i % 10], "Guide");
}

// 20 Glossaries
for(let i=1; i<=20; i++) {
  generateMarkdown(BLOG_DIR, `glossary-${i}`, `Glossary Term: TechConcept ${i}`, categories[i % 10], "Glossary");
}

// 20 Resources
for(let i=1; i<=20; i++) {
  generateMarkdown(BLOG_DIR, `resource-${i}`, `Top Tools for Developer ${i}`, categories[i % 10], "Resource");
}

// Phase 16: Authority Pages (Privacy Policy, Terms, etc.)
console.log('Generating Phase 16 Authority Pages...');
const authorityPages = [
  "Privacy Policy", "Terms", "Cookie Policy", "Accessibility", "Contact Info", "About Me", "Author", "Media Kit",
  "Press", "Testimonials Overview", "Client Success Stories", "Awards", "Certifications", "Speaking", "Open Source", "Community"
];

authorityPages.forEach(page => {
  generateMarkdown(AUTHORITY_PAGES_DIR, slugify(page), page, "Legal/Authority", "Authority Page");
});

console.log('✅ Phase 15 & 16 Mass Generation Complete!');
