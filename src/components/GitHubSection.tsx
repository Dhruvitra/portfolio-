import React from 'react';
import { motion } from 'motion/react';
import { Github, Star, GitFork, ExternalLink, Code2, ShoppingBag, Layers } from 'lucide-react';

interface Repo {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  stars: number;
  forks: number;
  liveUrl: string;
  githubUrl: string;
  category: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'Live' | 'Active' | 'Archived';
}

const REPOS: Repo[] = [
  {
    id: 'shopify-liquid-kit',
    name: 'shopify-liquid-kit',
    description: 'A reusable collection of high-performance custom Shopify Liquid section templates with AJAX cart drawer, product modals, and metafield support.',
    techStack: ['Shopify Liquid', 'Vanilla JS', 'CSS'],
    stars: 28,
    forks: 7,
    liveUrl: 'https://auden-apparel.myshopify.com',
    githubUrl: 'https://github.com/Dhruvitra',
    category: 'Shopify',
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    icon: ShoppingBag,
    status: 'Active',
  },
  {
    id: 'mern-crm-dashboard',
    name: 'mern-crm-dashboard',
    description: 'A full-stack CRM dashboard built with MongoDB, Express, React, and Node. Features JWT auth, real-time analytics, and a kanban task board.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
    stars: 41,
    forks: 12,
    liveUrl: 'https://linear.app',
    githubUrl: 'https://github.com/Dhruvitra',
    category: 'MERN Stack',
    accentColor: 'text-blue-600 bg-blue-50 border-blue-100',
    icon: Layers,
    status: 'Live',
  },
  {
    id: 'vite-portfolio-starter',
    name: 'vite-portfolio-starter',
    description: 'A blazing-fast portfolio template built with Vite, React, Framer Motion, and Tailwind CSS. Pre-configured with motion animations, dark mode, and SEO meta tags.',
    techStack: ['Vite', 'React', 'TypeScript', 'Framer Motion'],
    stars: 67,
    forks: 19,
    liveUrl: 'https://stripe.com',
    githubUrl: 'https://github.com/Dhruvitra',
    category: 'Frontend',
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    icon: Code2,
    status: 'Active',
  },
];

const statusColors: Record<string, string> = {
  Live: 'bg-emerald-500',
  Active: 'bg-blue-500',
  Archived: 'bg-slate-400',
};

export default function GitHubSection() {
  return (
    <section
      id="github"
      className="relative py-28 bg-[#F8FAFC] border-b border-slate-200 overflow-hidden"
    >
      <div className="absolute top-1/4 -left-24 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-[400px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
              05 • OPEN SOURCE
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">
              GitHub Repositories
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-xl leading-relaxed">
              Selected open-source projects and starter kits — browse the source, fork, and contribute.
            </p>
          </div>
          <a
            href="https://github.com/Dhruvitra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold rounded-xl transition-colors shrink-0"
          >
            <Github className="w-4 h-4" />
            View All on GitHub
          </a>
        </div>

        {/* Repo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPOS.map((repo, idx) => {
            const Icon = repo.icon;
            return (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400/50 hover:shadow-[0_12px_40px_rgba(37,99,235,0.07)] transition-all duration-500"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-2.5 rounded-xl border ${repo.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusColors[repo.status]} animate-pulse`} />
                      <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400">{repo.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-black text-[#0F172A] group-hover:text-blue-600 transition-colors font-mono">
                      {repo.name}
                    </span>
                  </div>

                  <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-3 text-slate-500 border-slate-200 bg-slate-50">
                    {repo.category}
                  </span>

                  <p className="text-xs text-slate-500 leading-relaxed mb-5 font-sans">
                    {repo.description}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {repo.techStack.map(t => (
                      <span key={t} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  {/* Stars & Forks */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      {repo.forks}
                    </span>
                  </div>

                  {/* Action links */}
                  <div className="flex gap-2">
                    <a
                      href={repo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Demo"
                      className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Source on GitHub"
                      className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
