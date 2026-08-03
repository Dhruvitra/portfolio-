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

// Topics and Keywords
const blogTopics = [
  "Shopify Development", "Next.js", "React", "Node.js", "NestJS",
  "AI Automation", "n8n", "MERN", "SaaS", "Web Performance"
];

const serviceTypes = [
  "shopify-development", "react-development", "nextjs-development", 
  "nodejs-development", "nestjs-development", "mern-development", 
  "ai-development", "n8n-development", "web-development", "ecommerce-development"
];

const locationTargets = [
  "shopify-developer-ahmedabad", "shopify-developer-gujarat", "shopify-developer-india",
  "nextjs-developer-india", "react-developer-india", "full-stack-developer-ahmedabad"
];

const caseStudyProjects = [
  "aura-ecommerce", "acuity-workspace", "novus-saas", "fintech-dashboard", "healthtech-portal"
]; // Let's expand this to 15 in the loop

// Utility to generate slug
const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           
  .replace(/[^\w\-]+/g, '')       
  .replace(/\-\-+/g, '-')         
  .replace(/^-+/, '')             
  .replace(/-+$/, '');            

// Markdown Generators
function generateBlogMarkdown(id, topic) {
  const title = `Ultimate Guide to ${topic} in 2026: Enterprise SEO Strategies`;
  const slug = slugify(title) + `-${id}`;
  const content = `---
title: "${title}"
description: "Discover the latest enterprise-grade strategies and SEO best practices for ${topic} development in 2026."
author: "Dhruvik Vanol"
date: "2026-08-01"
category: "${topic}"
tags: ["${topic}", "Web Development", "SEO", "Enterprise"]
readingTime: "8 min read"
---

# ${title}

Welcome to the ultimate guide on **${topic}**. In the fast-evolving landscape of web development, ensuring your architecture is robust, scalable, and optimized for search engines is critical.

## Why ${topic} Matters in 2026
${topic} has become the backbone of modern, high-performance web applications. By utilizing its advanced rendering strategies and extensive ecosystem, developers can achieve 100/100 Core Web Vitals.

## Core Best Practices
- **Performance Optimization**: Implement dynamic imports and code splitting.
- **SEO Accessibility**: Ensure all elements are fully semantic.
- **Scalability**: Leverage edge caching and CDNs.

## Conclusion
Partnering with an expert in ${topic} ensures your digital presence is not just modern, but mathematically optimized to dominate search rankings.
`;
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), content);
}

function generateServiceMarkdown(slug) {
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const content = `---
title: "Enterprise ${title} Services"
description: "Hire an expert for ${title}. Delivering high-performance, SEO-optimized, and scalable solutions for modern businesses."
serviceType: "${slug}"
---

# Expert ${title} Services

Are you looking for top-tier **${title}**? You're in the right place. We specialize in building enterprise-grade applications that guarantee 100/100 Lighthouse scores and maximum conversion rates.

## Our Approach to ${title}
We don't just write code; we architect solutions. Every line of code is optimized for Time to First Byte (TTFB), Cumulative Layout Shift (CLS), and overall Core Web Vitals.

## Key Deliverables
- **Custom Architecture**: Tailored precisely to your business needs.
- **SEO Dominance**: Outrank your competitors with semantic schema markup.
- **Extreme Performance**: Sub-second load times guaranteed.

Contact us today to elevate your digital infrastructure.
`;
  fs.writeFileSync(path.join(SERVICES_DIR, `${slug}.md`), content);
}

function generateLocationMarkdown(slug) {
  const parts = slug.split('-');
  const location = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
  const keyword = parts.slice(0, parts.length - 1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const content = `---
title: "Top ${keyword} in ${location}"
description: "Looking for the best ${keyword} in ${location}? We deliver award-winning, SEO-first web solutions."
location: "${location}"
---

# Top ${keyword} in ${location}

If you are searching for a highly skilled **${keyword} in ${location}**, your search ends here. We bring Silicon Valley engineering standards to ${location}.

## Why Choose Us in ${location}?
Local businesses in ${location} require localized SEO strategies. We embed rigorous LocalBusiness Schema, hyper-targeted landing pages, and rapid edge-caching to ensure you dominate the ${location} market.

## Our Expertise
We blend deep technical knowledge of ${keyword} with enterprise SEO tactics. 

Ready to build the best platform in ${location}? Let's connect.
`;
  fs.writeFileSync(path.join(LOCATIONS_DIR, `${slug}.md`), content);
}

function generateCaseStudyMarkdown(id) {
  const slug = `case-study-${id}`;
  const content = `---
title: "Project Alpha ${id}: A 100/100 SEO Transformation"
description: "Read how we engineered a complete technical overhaul achieving perfect Core Web Vitals and massive organic growth."
client: "Enterprise Corp ${id}"
industry: "Technology"
date: "2026-05-15"
---

# Project Alpha ${id}

## Overview
This case study breaks down our methodical approach to resolving deep architectural flaws in a monolithic application, migrating it to a modern headless stack.

## Problem
The client suffered from poor LCP (>4s) and severe layout shifts, causing a 40% drop in organic traffic.

## Solution & Architecture
We implemented a Jamstack architecture with edge-rendered HTML, strict CSP security headers, and an advanced automated image optimization pipeline using AVIF.

## Results
- **Performance**: 100/100 Lighthouse Score
- **Traffic**: +350% Organic Search Traffic
- **Conversions**: 2.5x increase in lead capture

## Tech Stack
React, Vite, Node.js, Tailwind CSS, JSON-LD Schema.
`;
  fs.writeFileSync(path.join(CASE_STUDIES_DIR, `${slug}.md`), content);
}

// Generate 50 Blogs
console.log('Generating Blogs...');
for (let i = 1; i <= 50; i++) {
  const topic = blogTopics[i % blogTopics.length];
  generateBlogMarkdown(i, topic);
}

// Generate Service Pages (20)
console.log('Generating Services...');
const extendedServices = [...serviceTypes];
for(let i=0; i<10; i++) extendedServices.push(`custom-software-development-${i}`);
extendedServices.forEach(generateServiceMarkdown);

// Generate Location Pages (20)
console.log('Generating Locations...');
const extendedLocations = [...locationTargets];
const cities = ["mumbai", "delhi", "bangalore", "pune", "london", "new-york", "dubai"];
for(let i=0; i<14; i++) {
  extendedLocations.push(`react-developer-${cities[i % cities.length]}-${i}`);
}
extendedLocations.forEach(generateLocationMarkdown);

// Generate Case Studies (15)
console.log('Generating Case Studies...');
for (let i = 1; i <= 15; i++) {
  generateCaseStudyMarkdown(i);
}

console.log('✅ All SEO content generated successfully.');
