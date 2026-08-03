import { useState, useRef, MouseEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Github, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Layers3, 
  Figma, 
  Zap, 
  X, 
  Laptop, 
  FolderCheck,
  CheckCircle2
} from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  category: 'Shopify' | 'MERN Stack' | 'Frontend' | 'UI/UX Design';
  description: string;
  fullDetails: string;
  problem: string;
  solution: string;
  result: string;
  challenges: string;
  features: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  figmaUrl?: string;
  accentClass: string;
  industry: string;
  completionDate: string;
  status: 'Live' | 'Beta' | 'In Production';
  stats: { label: string; value: string }[];
  highlight: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'shopify-candle',
    title: 'Aura Artisans — Luxury Custom Shopify Store',
    category: 'Shopify',
    description: 'High-conversion, performance-optimized custom Shopify 2.0 theme developed using Liquid, AJAX drawer-carts, and automated meta-field lookbooks.',
    fullDetails: 'A visual-first Shopify 2.0 storefront tailored for a boutique luxury brand. Replaced traditional heavy apps with custom lightweight Javascript integrations for sticky side-carts, size guides, and smart bundles, scaling mobile checkout speeds by 2x and lifting conversion rates by 4.2%.',
    problem: 'Client needed a modern online fashion and artisan store with fast checkout, mobile-first design, and a premium brand identity — but the existing off-the-shelf theme was slow, unresponsive, and non-customizable.',
    solution: 'Built a fully custom Shopify 2.0 storefront from scratch using Liquid templating, AJAX slide-out carts, and dynamic meta-field product sections. Replaced heavy third-party apps with lightweight custom JavaScript integrations.',
    result: 'Mobile checkout speed improved by 2x. Conversion rate increased by +35%. Lighthouse performance score reached A+. The client reported improved user engagement within the first 3 weeks of launch.',
    challenges: 'Integrating high-performance custom JS side-carts and sticky widgets without bloating page sizes or triggering cumulative layout shifts (CLS), while aligning custom Liquid variables with OS 2.0 schema inputs.',
    accentClass: 'from-[#10B981] to-[#047857]',
    industry: 'High-end E-Commerce',
    completionDate: 'April 2026',
    status: 'Live',
    features: [
      'Custom Liquid modules with robust schema definitions',
      'Mobile-optimized smart ajax slide-out cart drawer',
      '98/100 Core Web Vitals speed & SEO scoring',
      'Dynamic multi-currency & geo-localized payment processing'
    ],
    techStack: ['Shopify Liquid', 'Vanilla JS', 'Tailwind CSS', 'GraphQL Admin API'],
    liveUrl: 'https://auden-apparel.myshopify.com',
    githubUrl: 'https://github.com/Dhruvitra',
    stats: [
      { label: 'Mobile Speed Index', value: '0.9s' },
      { label: 'Conversion Lift', value: '+35%' },
      { label: 'Page load score', value: 'A+' }
    ],
    highlight: 'Liquid custom section panels'
  },
  {
    id: 'mern-flow',
    title: 'Acuity Dashboard — Full MERN CRM Workspace',
    category: 'MERN Stack',
    description: 'Advanced workspace management suite offering real-time task pipelines, secure JWT encryption, structured MongoDB indices, and visual analytical widgets.',
    fullDetails: 'A secure CRM application geared for small startups. Leverages Node/Express controllers on the server side, JWT state security, and Mongoose indexing to enable lightning fast query response times. The responsive board organizes custom user states and schedules drag-and-drop tasks.',
    problem: 'A growing startup needed an internal CRM dashboard to manage clients, sales pipelines, and team tasks — but existing SaaS tools were too expensive and generic for their workflow.',
    solution: 'Built a full MERN stack CRM from scratch with a secure Express.js REST API, JWT authentication, MongoDB with proper indexing, and a React dashboard with real-time analytics widgets and a kanban-style task board.',
    result: 'Server latency dropped to 18ms. The team reported 40% faster task management. 99.9% uptime in the first month. Client saved $800/month by replacing legacy SaaS subscriptions.',
    challenges: 'Optimizing high-frequency database read/write queries for active pipelines and handling real-time JWT secure cookie-token lifecycles across multiple sub-domains securely.',
    accentClass: 'from-[#3B82F6] to-[#1D4ED8]',
    industry: 'Enterprise Software / SaaS',
    completionDate: 'February 2026',
    status: 'Live',
    features: [
      'JWT server-to-client tokenized authentication cookie loops',
      'Draggable priority project queues with reactive lists',
      'High fidelity analytics dashboards with real-time charts',
      'Integrated MongoDB aggregates & indexed query operations'
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Recharts'],
    liveUrl: 'https://linear.app',
    githubUrl: 'https://github.com/Dhruvitra',
    stats: [
      { label: 'Server Latency', value: '18ms' },
      { label: 'Active Pipeline', value: 'Realtime' },
      { label: 'Uptime Reliability', value: '99.9%' }
    ],
    highlight: 'Secure JWT Node gateway'
  },
  {
    id: 'frontend-novus',
    title: 'Novus SaaS — Responsive Brand Portal',
    category: 'Frontend',
    description: 'Breathtaking digital presentation platform highlighting premium keyframe scrolling parallax grids, pristine typography, and 60 FPS CSS animations.',
    fullDetails: 'A pixel-perfect high-fidelity landing experience engineered strictly for visual conversation. Crafted with custom-tailored Framer Motion trigger blocks, fluid interactive SVG icons, and lightweight image loading strategies to guarantee 0 cumulative layout shift (CLS).',
    problem: 'A SaaS startup needed a high-converting landing page to attract investors and users, but their previous agency delivered a slow, template-based page with poor animation and a high bounce rate.',
    solution: 'Designed and developed a custom Vite + React SPA with Framer Motion scroll-reveal animations, a parallax hero, and optimized lazy-loading images. Zero external UI frameworks used — every component was handcrafted.',
    result: 'First Contentful Paint achieved in 0.4s. Bounce rate decreased by 28% in the first month. SEO score reached 100/100 on Lighthouse. Animations run at a consistent 60 FPS on all tested devices.',
    challenges: 'Achieving a consistent 60 FPS viewport-reveal rendering loop on lower-end mobile chipsets, and removing layout shifts from heavy parallax assets.',
    accentClass: 'from-[#6366F1] to-[#4F46E5]',
    industry: 'Financial Technologies / SaaS',
    completionDate: 'May 2026',
    status: 'Live',
    features: [
      'Dynamic viewport animation curves powered by motion',
      'Bespoke fluid layout matrices adjusting natively',
      'Optimized lightweight asset prefetching routines',
      'Clean SEO semantic structure & accessibility compliant'
    ],
    techStack: ['Vite CSS Spa', 'Taylor-fit React Hooks', 'Framer Motion', 'PostCSS Theme'],
    liveUrl: 'https://stripe.com',
    githubUrl: 'https://github.com/Dhruvitra',
    stats: [
      { label: 'Animation FPS', value: '60fps' },
      { label: 'First Content Paint', value: '0.4s' },
      { label: 'SEO Performance', value: '100/100' }
    ],
    highlight: 'Liquid fluid typography'
  },
  {
    id: 'uiux-system',
    title: 'Vectra Core — Figma Enterprise Design System',
    category: 'UI/UX Design',
    description: 'High-fidelity dark SaaS style guide & interactive design ecosystem comprising fluid responsive grids, unified typography scales, and 400+ custom components.',
    fullDetails: 'A standardized system configured carefully in Figma to bridge the gap between design and development codebases. Formulates robust variant properties, auto-layout 4.0 modules, unified space margins, and custom interactive prototypes with seamless user states.',
    problem: 'A product team of 6 designers was producing inconsistent UI — different fonts, icon sizes, and color usages across screens, causing slow development handoffs and mismatched production builds.',
    solution: 'Built a unified enterprise Figma Design System with auto-layout 5.0, shared color/typography tokens, 420+ modular components with dark/light variants, and interactive prototypes that simulate real user flows.',
    result: 'Design-to-dev handoff time reduced by 60%. The engineering team eliminated 90% of CSS guesswork. Consistent brand identity achieved across 32 screen templates. System is still actively maintained.',
    challenges: 'Mapping variant states and spacing parameters accurately to react code structures to ensure that developers have zero styling ambiguity.',
    accentClass: 'from-[#EC4899] to-[#D946EF]',
    industry: 'Digital Product Design',
    completionDate: 'December 2025',
    status: 'Live',
    features: [
      'Interactive Figma high-fidelity clickable wireframe prototype',
      'Automated dark / light token variables with nested guides',
      'Unified type hierarchy paired with beautiful tracking configurations',
      'Custom modular UI elements mapping to code structures'
    ],
    techStack: ['Figma 2026', 'Auto-Layout 5.0', 'Design System System', 'Framer Prototypes'],
    liveUrl: 'https://figma.com',
    figmaUrl: 'https://figma.com',
    stats: [
      { label: 'Modular Elements', value: '420+' },
      { label: 'Developer Sync', value: '100%' },
      { label: 'Page Layouts', value: '32 Templates' }
    ],
    highlight: 'Variant logic tokenization'
  }
];

// Interactive client-side custom card with Apple-inspired 3D Hover Tilt Effect
function ProjectCard({ project, index, onOpenDetails }: { project: Project; index: number; onOpenDetails: (p: Project) => void; key?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse coords relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates (-0.5 to 0.5)
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    
    // Maximum tilt angles in degrees
    const maxTilt = 8;
    setRotateX(-normY * maxTilt);
    setRotateY(normX * maxTilt);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: rotateX === 0 && rotateY === 0 ? 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s ease-out'
      }}
      className="group/card relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-blue-500/50 hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] overflow-hidden transition-all duration-500 h-[565px]"
    >
      {/* Glossy sheen reflection overlay that pans on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover/card:animate-shimmer pointer-events-none" />

      {/* Embedded High Fidelity Custom Visual Vector Mockup to simulate interactive design rendering dynamically -> Now styled in beautiful light presets */}
      <div className="relative w-full h-[210px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-5 flex flex-col group-hover/card:border-slate-200 transition-all">
        {/* Browser Top Navigation Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200/60 px-4 py-2 flex items-center justify-between select-none">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider lowercase truncate max-w-[150px]">
            {project.id === 'shopify-candle' ? 'aura-store.com' : project.id === 'mern-flow' ? 'acuity-workspace.app' : project.id === 'frontend-novus' ? 'novus-saas.io' : 'figma.com/design-file'}
          </p>
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Live Vector Preview Canvas */}
        <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden relative bg-white select-none">
          {/* Subtle Ambient Background Highlight glowing based on project category colors */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-42 h-42 bg-gradient-to-r ${project.accentClass} opacity-[0.06] rounded-full blur-2xl`} />

          {project.id === 'shopify-candle' && (
            <div className="flex flex-col h-full justify-between py-1 relative z-10 text-slate-800">
              <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5">
                <span className="font-extrabold tracking-widest text-emerald-600">AURA ARTISANS</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 font-bold">Store is Live</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 flex-grow items-center">
                <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-xl flex flex-col">
                  <div className="h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] font-bold text-slate-400">🍂</div>
                  <p className="text-[7.5px] text-center font-extrabold mt-1 text-slate-600 truncate">Sandal Candle</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-xl flex flex-col">
                  <div className="h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] font-bold text-slate-400">🪵</div>
                  <p className="text-[7.5px] text-center font-extrabold mt-1 text-slate-600 truncate">Teakwood Block</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-xl flex flex-col">
                  <div className="h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] font-bold text-slate-400">🌾</div>
                  <p className="text-[7.5px] text-center font-extrabold mt-1 text-slate-600 truncate">Sage Smudge</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 h-7 px-2.5 rounded-lg border border-emerald-100 text-[8px] text-emerald-600 font-bold">
                <p>Shopify checkout speed optimized</p>
                <ShoppingBag className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          )}

          {project.id === 'mern-flow' && (
            <div className="flex flex-col h-full justify-between py-1 relative z-10 text-slate-800">
              <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5">
                <span className="font-extrabold tracking-widest text-blue-600">ACUITY HUB</span>
                <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">REST Secure</span>
              </div>
              <div className="grid grid-cols-2 gap-2 flex-grow items-center py-2">
                <div className="bg-white border border-slate-150 rounded-xl p-2 shadow-sm">
                  <span className="text-[6.5px] font-mono font-bold text-slate-400 block">TOTAL SALES REPORT</span>
                  <p className="text-xs font-black text-slate-900 font-mono mt-0.5">$38,201.40</p>
                  <p className="text-[6.5px] text-emerald-600 font-bold">+12.4% analytics lift</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-xl p-2 shadow-sm">
                  <span className="text-[6.5px] font-mono font-bold text-slate-400 block">PENDING PIPELINES</span>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[6.5px] text-slate-500 mt-1 font-mono">
                    <span>Task limit</span>
                    <span>75% done</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {project.id === 'frontend-novus' && (
            <div className="flex flex-col h-full justify-between py-1 relative z-10 text-slate-800">
              <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5">
                <span className="font-extrabold tracking-widest text-indigo-600">NOVUS CORE</span>
                <span className="text-[8px] text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-1.5 py-0.5 rounded font-bold">60 FPS CSS</span>
              </div>
              <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
                <span className="text-[8px] px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-650 rounded-full font-bold uppercase tracking-widest mb-1.5">
                  Ultra Fast Delivery
                </span>
                <h4 className="text-[11px] font-black tracking-tight text-slate-900 leading-tight">
                  High Performance SaaS Landing Engine.
                </h4>
                <p className="text-[7.5px] text-slate-500 mt-1 leading-snug">
                  Integrated vector scrolls mapping system deliverables gracefully.
                </p>
              </div>
            </div>
          )}

          {project.id === 'uiux-system' && (
            <div className="flex flex-col h-full justify-between py-1 relative z-10 text-slate-800">
              <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5">
                <span className="font-extrabold tracking-widest text-[#D946EF]">VECTRA VAULT</span>
                <span className="text-[8px] text-[#D946EF] bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded font-bold">Auto-Layout 5.0</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 flex-grow items-center py-2">
                {['Buttons', 'Modals', 'Inputs', 'Dropdown'].map((lbl, idx) => (
                  <div key={lbl} className="bg-white border border-slate-150 p-1.5 rounded-xl flex flex-col justify-between h-14 relative overflow-hidden shadow-sm">
                    <span className="text-[6.5px] text-slate-400 block font-bold">0{idx + 1}</span>
                    <span className="text-[7.5px] font-extrabold text-slate-700 leading-tight truncate">{lbl}</span>
                    <div className="absolute right-1 bottom-1 w-2 h-2 rounded-full bg-pink-500/20" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Badge & Live Project Status Label */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-mono rounded-full uppercase font-bold">
          {project.category}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-widest">
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Heading & Short Description */}
      <div className="flex-grow">
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover/card:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-[12px] text-slate-500 leading-relaxed mb-5 line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Dynamic Statistics Panel showing target variables in the card */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 grid grid-cols-3 gap-2 mb-5">
        {project.stats.map(s => (
          <div key={s.label} className="text-center">
            <span className="text-[11px] text-slate-800 font-extrabold block tracking-tight">{s.value}</span>
            <span className="text-[8px] text-slate-500 font-semibold block truncate uppercase mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Interactive Stack list */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.techStack.slice(0, 3).map(st => (
          <span key={st} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            {st}
          </span>
        ))}
        {project.techStack.length > 3 && (
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            +{project.techStack.length - 3} more
          </span>
        )}
      </div>

      {/* Action Button Strip - Redesigned to show 3 prominent text buttons side by side */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-auto">
        {/* Case Study Navigation Button */}
        <button
          onClick={() => {
            window.history.pushState(null, '', '/case-study/' + project.id);
          }}
          className="py-2.5 px-1 rounded-xl bg-slate-900 hover:bg-blue-600 hover:shadow-md text-white text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <span>Case Study</span>
        </button>

        {/* Live Link Button */}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-1 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs select-none"
        >
          <span>Live Demo</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
        </a>

        {/* GitHub / Workspace Source Button */}
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-1 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs select-none"
          >
            <span>GitHub</span>
            <Github className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
          </a>
        ) : project.figmaUrl ? (
          <a
            href={project.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-1 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs select-none"
          >
            <span>Figma</span>
            <Figma className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Shopify' | 'MERN Stack' | 'Frontend' | 'UI/UX Design'>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <section 
      id="projects" 
      className="relative py-28 bg-[#F8FAFC] border-b border-slate-200 overflow-hidden text-slate-900"
    >
      {/* Light Ambient Grid Overlays */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* Cybernetic Glowing Gradients */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Headings */}
        <div className="max-w-3xl text-left mb-16 flex flex-col">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="p-1 px-2.5 rounded-md bg-blue-50 border border-blue-200 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
              02 • Selected Projects Vault
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-none mb-4">
            Featured Projects
          </h2>

          <p className="text-slate-600 mt-1 leading-relaxed text-sm md:text-base font-sans max-w-2xl">
            A collection of real-world applications, Shopify stores, and digital products built for startups, businesses, and agencies. Each project demonstrates practical problem-solving, modern development practices, scalable architecture, and user-focused design.
          </p>
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-slate-200 max-w-xl">
          {(['All', 'Shopify', 'MERN Stack', 'Frontend', 'UI/UX Design'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-black transition-all duration-300 relative select-none cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Projects Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={idx} 
                onOpenDetails={(p) => setActiveProject(p)} 
              />
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Case Study Full Dialog Modal Overlay (Apple inspired specsheet design) */}
      {createPortal(
        <AnimatePresence>
          {activeProject && (
            <motion.div
              id="case-study-modal"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop frosted screen */}
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => setActiveProject(null)}
              />

              {/* Modal Body Card (Light layout) */}
              <motion.div
                className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] z-10 text-slate-800"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-xs font-mono text-blue-600 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> CASE SPECIFICATION
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Industry / Date */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <span className="text-[11px] font-mono text-indigo-600 font-bold tracking-widest uppercase">
                    {activeProject.industry} • {activeProject.completionDate}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {activeProject.title}
                  </h3>
                </div>

                {/* Dynamic Statistics Panel inside modal */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 grid grid-cols-3 gap-4 mb-6">
                  {activeProject.stats.map(s => (
                    <div key={s.label} className="text-center">
                      <span className="text-base md:text-lg text-slate-850 font-black block tracking-tight font-mono">{s.value}</span>
                      <span className="text-[9px] text-slate-550 font-bold block truncate uppercase mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-5">
                  {/* Problem */}
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 mb-1.5 font-mono flex items-center gap-1.5">
                      🎯 PROBLEM
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">{activeProject.problem}</p>
                  </div>

                  {/* Solution */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 mb-1.5 font-mono flex items-center gap-1.5">
                      💡 SOLUTION
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">{activeProject.solution}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 font-mono flex items-center gap-1.5">
                      <FolderCheck className="w-3.5 h-3.5 text-blue-500" /> KEY FEATURES
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeProject.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-500" /> TECHNOLOGIES USED
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.techStack.map(tg => (
                        <span key={tg} className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Result */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mb-1.5 font-mono flex items-center gap-1.5">
                      ✅ RESULTS
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">{activeProject.result}</p>
                  </div>
                </div>

                {/* Call to action panel at bottom of modal */}
                <div className="flex flex-wrap items-center gap-3.5 mt-8 pt-6 border-t border-slate-200/80">
                  <a
                    href={`mailto:dhruviktra.rajput.1379@gmail.com?subject=Regarding ${encodeURIComponent(activeProject.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveProject(null)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10"
                  >
                    <span>Inquire Regarding Stack</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a 
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
}
