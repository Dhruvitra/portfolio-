import { useState, ComponentType } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Code2, 
  Figma, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  LayoutDashboard, 
  ShieldCheck, 
  CheckCircle2,
  Smartphone,
  Layers
} from 'lucide-react';

interface ServiceSubItem {
  name: string;
  tagline: string;
  description: string;
  features: string[];
}

interface ServiceGroup {
  id: string;
  categoryName: string;
  categoryTagline: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accentColor: string;
  borderHoverColor: string;
  bgGradient: string;
  items: ServiceSubItem[];
}

const SERVICES_GROUPS: ServiceGroup[] = [
  {
    id: 'shopify-dev',
    categoryName: 'Shopify Development',
    categoryTagline: 'Liquid & Storefront Engineering',
    description: 'Custom e-commerce architectures optimized for speed, conversion, and seamless administration.',
    icon: ShoppingBag,
    accentColor: 'text-emerald-500',
    borderHoverColor: 'hover:border-emerald-500/30 hover:shadow-[0_15px_40px_rgba(16,185,129,0.06)]',
    bgGradient: 'from-emerald-500/[0.03] to-emerald-500/[0.01]',
    items: [
      {
        name: 'Store Setup',
        tagline: 'Launch-Ready Stores',
        description: 'End-to-end setup including domain settings, product catalogs, collections structure, and localized payment processing.',
        features: ['Product Collections & Variants', 'Payment & Shipping Loops', 'Domain & SEO Configurations']
      },
      {
        name: 'Theme Customization',
        tagline: 'Bespoke Brand Styling',
        description: 'Elevating off-the-shelf templates with customized brand adjustments and unique Liquid layouts.',
        features: ['Custom Liquid Page Schemas', 'Pristine Branding Alignment', 'Responsive Grid Integration']
      },
      {
        name: 'Custom Sections',
        tagline: 'Dynamic Custom Sections Everywhere',
        description: 'Developing reusable sections, slide-out side drawers, interactive lookbooks, and size calculator drawers.',
        features: ['AJAX Slide-Out Slide Carts', 'Draggable Section Blocks', 'Size Charts & Lookbook Modals']
      },
      {
        name: 'Speed Optimization',
        tagline: 'Lighthouse Performance Focus',
        description: 'Eliminating app bloat, compression of assets, script deferrals, and custom critical CSS extraction.',
        features: ['Critical CSS & Image Lazy Load', 'App Script Deferrals & Purging', 'Sub-second Load Times (Lighthouse A+)']
      }
    ]
  },
  {
    id: 'mern-dev',
    categoryName: 'Full Stack & MERN Development',
    categoryTagline: 'Next.js & Node.js Engineering',
    description: 'Production-ready full-stack applications with robust backend controllers and reactive user interfaces.',
    icon: Code2,
    accentColor: 'text-blue-500',
    borderHoverColor: 'hover:border-blue-500/30 hover:shadow-[0_15px_40px_rgba(59,130,246,0.06)]',
    bgGradient: 'from-blue-500/[0.03] to-blue-500/[0.01]',
    items: [
      {
        name: 'Admin Panels & Automation',
        tagline: 'n8n & Internal Tools',
        description: 'Secure dashboard modules and n8n workflow automations built for internal administration with role-based JWT authentication.',
        features: ['Role-Based Authentication (JWT)', 'n8n Workflow Automation', 'Database Verification Logs']
      },
      {
        name: 'CRM Systems',
        tagline: 'Lead & Pipeline Workspaces',
        description: 'Custom client trackers, lead pipelines, drag-and-drop task boards, and team calendars.',
        features: ['Custom Pipeline Builder', 'Client & Task Tracking Boards', 'Analytics Reporting Panels']
      },
      {
        name: 'SaaS Applications',
        tagline: 'Scalable Cloud Products',
        description: 'Custom full-stack SaaS engines built using React, Next.js, Node.js controllers, and MongoDB operations.',
        features: ['REST & GraphQL API Endpoints', 'Next.js Server-Side Rendering', 'Deployment & Cloud Integration']
      },
      {
        name: 'Custom Dashboards',
        tagline: 'Information-Dense Panels',
        description: 'Data analytics display dashboards using Recharts, live data trackers, and user metrics blocks.',
        features: ['Real-time Charts (Recharts)', 'Interactive State Management', 'Modern UI Analytics Widgets']
      }
    ]
  },
  {
    id: 'uiux-design',
    categoryName: 'UI/UX Design',
    categoryTagline: 'Digital Experience Design',
    description: 'Modern, high-fidelity prototypes and layouts designed strictly to maximize conversions and user clarity.',
    icon: Figma,
    accentColor: 'text-indigo-500',
    borderHoverColor: 'hover:border-indigo-500/30 hover:shadow-[0_15px_40px_rgba(99,102,241,0.06)]',
    bgGradient: 'from-indigo-500/[0.03] to-indigo-500/[0.01]',
    items: [
      {
        name: 'Figma Design',
        tagline: 'Atomic Spec Layouts',
        description: 'Design files built using Figma Auto-Layout, shared color/type tokens, and modular components.',
        features: ['Auto-Layout 5.0 Systems', 'Clickable Wireframe Prototypes', 'Shared Token Variables']
      },
      {
        name: 'Landing Pages',
        tagline: 'Conversion-First Design',
        description: 'Breathtaking visual scrolls featuring parallax layouts, scroll-reveals, and performance coding.',
        features: ['Viewport Scroll Animations', 'Responsive Form Interfaces', 'Zero CLS Performance']
      },
      {
        name: 'Dashboard UI',
        tagline: 'Clear Data Visualization',
        description: 'Information-dense layouts showing complex analytical metrics in clean, accessible ways.',
        features: ['Interactive Component States', 'Dark / Light Mode Variants', 'Information-Dense Grid Specs']
      }
    ]
  }
];

const METRICS = [
  { value: '10+', label: 'Projects Completed' },
  { value: '5+', label: 'Technologies Mastered' },
  { value: '100%', label: 'Responsive Design' },
  { value: 'A+', label: 'Performance Focused' },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState<string>('shopify-dev');

  return (
    <section 
      id="services" 
      className="relative py-28 bg-[#FFFFFF] border-b border-slate-150 overflow-hidden"
    >
      {/* Soft Decorative Grid Overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-slate-50/40 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 font-sans">
        
        {/* Header Grid styling */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
              03 • SERVICES SUITE
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Services Offered
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#334155] text-sm md:text-base leading-relaxed max-w-lg">
              Every service is delivered without generic boilerplate shortcuts — 
              just clean, handcrafted solutions tailored specifically for performance and business results.
            </p>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center"
            >
              <span className="text-3xl font-black text-[#2563EB] tracking-tight">{m.value}</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 font-mono">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-slate-200 max-w-3xl">
          {SERVICES_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isSelected = activeTab === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                className={`px-5 py-3 rounded-full text-xs font-black transition-all duration-300 relative select-none cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <GroupIcon className="w-4 h-4" />
                <span>{group.categoryName}</span>
              </button>
            );
          })}
        </div>

        {/* Services Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Category Description Panel */}
          {SERVICES_GROUPS.map((group) => {
            if (group.id !== activeTab) return null;
            const CategoryIcon = group.icon;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 ${group.accentColor}`}>
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-[#2563EB] uppercase font-bold block mb-2">
                    {group.categoryTagline}
                  </span>
                  <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-4">
                    {group.categoryName}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#334155]">
                    {group.description}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6 mt-8">
                  <div className="flex items-center justify-between text-xs text-slate-650 font-bold mb-4">
                    <span>Average turnaround:</span>
                    <span className="text-slate-900">7 - 14 Days</span>
                  </div>

                  {/* Starting Pricing Estimates Card - Priority 5 */}
                  <div className="bg-white border border-slate-205/60 rounded-2xl p-4 mb-6 space-y-2.5 shadow-2xs font-sans">
                    <h5 className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">Estimated Starting Pricing</h5>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span>Landing Page</span>
                      <span className="text-blue-650 font-extrabold">From ₹5,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 border-t border-slate-100 pt-2">
                      <span>Business Website</span>
                      <span className="text-blue-650 font-extrabold">From ₹10,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 border-t border-slate-100 pt-2">
                      <span>Shopify Store</span>
                      <span className="text-blue-650 font-extrabold">From ₹15,000</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire About {group.categoryName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Sub-Services Grid Display */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES_GROUPS.map((group) => {
              if (group.id !== activeTab) return null;

              return group.items.map((subItem, idx) => (
                <motion.div
                  key={subItem.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`group relative rounded-3xl p-6 border border-slate-200 bg-white transition-all duration-500 flex flex-col justify-between min-h-[260px] ${group.borderHoverColor}`}
                >
                  {/* Subtle Accent Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${group.bgGradient} rounded-full blur-xl pointer-events-none`} />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-mono tracking-widest text-[#2563EB] bg-blue-50/50 border border-blue-100/50 px-2 py-0.5 rounded-md font-bold uppercase">
                        {subItem.tagline}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest text-slate-350 uppercase">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <h4 className="text-base font-extrabold text-[#0F172A] tracking-tight mb-2 group-hover:text-blue-650 transition-colors">
                      {subItem.name}
                    </h4>
                    <p className="text-xs leading-relaxed text-[#334155] mb-5">
                      {subItem.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <ul className="space-y-2">
                      {subItem.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[11px] text-[#0F172A] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ));
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
