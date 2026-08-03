import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Figma, 
  Sparkles, 
  CheckCircle2, 
  Layers3, 
  ShieldCheck, 
  Compass, 
  Zap, 
  TrendingUp, 
  Clock, 
  Laptop
} from 'lucide-react';
import { PROJECTS } from './Projects';

interface CaseStudyPageProps {
  projectId: string;
}

export default function CaseStudyPage({ projectId }: CaseStudyPageProps) {
  // Find project
  const project = PROJECTS.find(p => p.id === projectId);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Case Study Not Found</h2>
        <p className="text-slate-550 mb-6 max-w-sm">The project you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => window.history.pushState(null, '', '/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>
    );
  }

  const handleBack = () => {
    window.history.pushState(null, '', '/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-28"
    >
      <Helmet>
        <title>{project.title} | Dhruvik Vanol Portfolio</title>
        <meta name="description" content={project.description} />
        <meta property="og:title" content={`${project.title} | Case Study`} />
        <meta property="og:description" content={project.description} />
      </Helmet>
      {/* Dynamic Floating Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r ${project.accentClass} opacity-[0.05] rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute top-[60vh] right-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-black text-slate-650 hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50/50 transition-all">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>Back to Portfolio</span>
          </button>

          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-bold border border-slate-200 px-3 py-1 rounded-full bg-slate-50">
            Case Study • {project.category}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-12 relative z-10">
        
        {/* Breadcrumb / Metadata Banner */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-indigo-600 font-bold mb-4 uppercase tracking-widest">
          <span>{project.industry}</span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.completionDate}</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px]">
            <span className="w-1 h-1 rounded-full bg-emerald-500" /> {project.status}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-tight mb-8">
          {project.title}
        </h1>

        {/* Dynamic Vector Interactive Mockup (Larger Version) */}
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden mb-12">
          {/* Browser Navigation */}
          <div className="bg-slate-100/90 border-b border-slate-200/60 px-5 py-3 rounded-t-2xl flex items-center justify-between select-none">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] font-mono font-bold text-slate-400 tracking-widest lowercase">
              {project.id === 'shopify-candle' ? 'aura-store.com' : project.id === 'mern-flow' ? 'acuity-workspace.app' : project.id === 'frontend-novus' ? 'novus-saas.io' : 'figma.com/design-file'}
            </p>
            <Laptop className="w-4 h-4 text-slate-400" />
          </div>

          {/* Interactive Core Preview Canvas */}
          <div className="bg-[#FAFBFD] p-6 md:p-10 min-h-[280px] flex flex-col justify-center relative overflow-hidden rounded-b-2xl">
            {/* Soft Ambient Background highlight */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.accentClass} opacity-[0.08] rounded-full blur-3xl`} />

            {/* Custom Project visual elements rendering */}
            <div className="relative z-10 text-slate-800">
              {project.id === 'shopify-candle' && (
                <div className="max-w-lg mx-auto bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold tracking-widest text-emerald-600 font-mono">AURA ARTISANS CO.</span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50 font-bold uppercase">SHOP LIVE</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Luxury Organic Aromatherapy Storefront</h3>
                  <p className="text-xs text-slate-550 mb-4 leading-relaxed">
                    Designed and built with dynamic custom schema modules, ajax side drawer integrations, size calculators, and multi-currency localized checkout.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">98/100 Core Web Vitals</span>
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">Sub-1s Load Time</span>
                  </div>
                </div>
              )}

              {project.id === 'mern-flow' && (
                <div className="max-w-lg mx-auto bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold tracking-widest text-blue-600 font-mono">ACUITY CORE</span>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100/50 font-bold uppercase">SECURE REST</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Workspace & Pipeline Analytics</h3>
                  <p className="text-xs text-slate-550 mb-4 leading-relaxed">
                    Startups CRM including interactive kanban prioritizers, drag-and-drop workflow updates, security cookies JWT token validation, and Recharts statistics.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">18ms Latency</span>
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">Role Access JWT</span>
                  </div>
                </div>
              )}

              {project.id === 'frontend-novus' && (
                <div className="max-w-lg mx-auto bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm text-center">
                  <span className="inline-block text-[9px] px-2.5 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-650 rounded-full font-bold uppercase tracking-wider mb-2.5">
                    60 FPS SCROLL RENDERING
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Novus SaaS Web Presence</h3>
                  <p className="text-xs text-slate-550 mb-4 leading-relaxed">
                    Stunning digital platform optimized strictly for zero cumulative layout shift (CLS) and lightning-fast asset loading speeds.
                  </p>
                  <div className="flex justify-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">0.4s FCP Speed</span>
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">Lightweight Assets</span>
                  </div>
                </div>
              )}

              {project.id === 'uiux-system' && (
                <div className="max-w-lg mx-auto bg-white border border-slate-200/70 p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold tracking-widest text-pink-600 font-mono">VECTRA CORE DS</span>
                    <span className="text-[9px] px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full border border-pink-100/50 font-bold uppercase">FIGMA VARIANTS</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Atomized Enterprise Design Ecosystem</h3>
                  <p className="text-xs text-slate-550 mb-4 leading-relaxed">
                    Modular interface layouts configuring auto-layouts, nested variables, font heights, dark/light presets, and click wireframes.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">420+ Components</span>
                    <span className="text-[10px] font-mono px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded">Design-Dev Sync</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Target Metrics stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {project.stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 p-6 rounded-2xl text-center shadow-xs flex flex-col justify-center"
            >
              <span className="text-3xl font-black text-blue-600 tracking-tight font-mono mb-1">{s.value}</span>
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Detailed case sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Main Case column */}
          <div className="md:col-span-2 space-y-6">
            {/* Problem card */}
            <div className="p-6 md:p-8 rounded-3xl bg-rose-50/50 border border-rose-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/[0.02] rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs font-black tracking-[0.2em] text-rose-500 font-mono uppercase mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Target Problem
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base font-sans">
                {project.problem}
              </p>
            </div>

            {/* Solution card */}
            <div className="p-6 md:p-8 rounded-3xl bg-blue-50/50 border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs font-black tracking-[0.2em] text-blue-600 font-mono uppercase mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Applied Solution
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base font-sans">
                {project.solution}
              </p>
            </div>

            {/* Results card */}
            <div className="p-6 md:p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs font-black tracking-[0.2em] text-emerald-600 font-mono uppercase mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verifiable Results
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base font-sans">
                {project.result}
              </p>
            </div>

            {/* Challenges card - Priority 4 */}
            <div className="p-6 md:p-8 rounded-3xl bg-amber-50/50 border border-amber-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs font-black tracking-[0.2em] text-amber-600 font-mono uppercase mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Technical Challenges
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base font-sans">
                {project.challenges}
              </p>
            </div>
          </div>

          {/* Right sidebar column */}
          <div className="space-y-6">
            {/* Features block */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
              <h3 className="text-xs font-mono font-black text-slate-400 tracking-wider uppercase mb-5">
                Key Features
              </h3>
              <ul className="space-y-4">
                {project.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-xs font-semibold text-slate-700 leading-normal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies list */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
              <h3 className="text-xs font-mono font-black text-slate-400 tracking-wider uppercase mb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tg => (
                  <span 
                    key={tg}
                    className="text-[11px] font-mono text-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium"
                  >
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions block */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Demo button */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10"
            >
              <span>Visit Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* GitHub or Figma button */}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-750 hover:text-slate-900 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Codebase</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            ) : project.figmaUrl ? (
              <a
                href={project.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-750 hover:text-slate-900 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Figma Design</span>
                <Figma className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </div>

          {/* Contact Inquiry button */}
          <button
            onClick={() => {
              // Redirect back home and scroll to contact
              window.history.pushState(null, '', '/');
              setTimeout(() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 150);
            }}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Inquire About Similar Project</span>
          </button>
        </div>

      </main>
    </motion.div>
  );
}
