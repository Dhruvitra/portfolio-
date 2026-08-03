import { ComponentType } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Terminal, Figma, Award, CheckCircle2 } from 'lucide-react';

interface TimelineStage {
  year: string;
  role: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  points: string[];
}

const JOURNEY: TimelineStage[] = [
  {
    year: '2024 — PRESENT',
    role: 'Lead Shopify & Full Stack Architect',
    title: 'High-Scale Storefront Customization',
    icon: ShoppingBag,
    description: 'Directing complex layout customizations and Shopify API integration for multi-national fashion and commodity brands.',
    points: [
      'Pioneered section-everywhere customized Liquid blocks to eliminate user friction.',
      'Refactored AJAX checkout models to lift purchase completions.',
      'Constructed headless React storefront sync structures for speed.'
    ]
  },
  {
    year: '2023 — 2024',
    role: 'Full Stack MERN System Engineer',
    title: 'Enterprise Dashboard Administration',
    icon: Terminal,
    description: 'Designed secure dashboard portals coordinates with Node REST endpoints, handling customer transaction flows.',
    points: [
      'Integrated JSON Web Token session protocols inside Express setups.',
      'Managed MongoDB structures using indexing rules to boost query performance.',
      'Refactored slow query maps to optimize page load parameters.'
    ]
  },
  {
    year: '2022 — 2023',
    role: 'UI/UX Visual Prototyper',
    title: 'High Fidelity Product Systems',
    icon: Figma,
    description: 'Crafted unified Figma token standards and layout guidelines, allowing simple design handoffs into code.',
    points: [
      'Mapped modular layout patterns prior to writing CSS elements.',
      'Executed interface tests across responsive viewport breaks.',
      'Created conversion-focused layouts to boost customer sign-ups.'
    ]
  },
  {
    year: '2021 — 2022',
    role: 'Independent Tech Consultant',
    title: 'Bespoke Brand Launches',
    icon: Award,
    description: 'Delivered end-to-end Shopify stores and functional landing landing pages for select partners looking for custom designs.',
    points: [
      'Provided direct consultations to define client features and goals.',
      'Delivered fully responsive Shopify custom setups.',
      'Completed optimization sweeps to pass Google Lighthouse checks.'
    ]
  }
];

export default function Timeline() {
  return (
    <section 
      id="experience" 
      className="relative py-28 bg-[#FFFFFF] border-b border-slate-100 overflow-hidden"
    >
      {/* Decorative vertical coordinates overlay */}
      <div className="absolute top-1/2 left-4 w-44 h-44 bg-blue-50/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="max-w-2xl text-left mb-20">
          <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
            04 • MILESTONES
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Journey & Work History
          </h2>
          <p className="text-[#334155] mt-4 leading-relaxed font-sans">
            A comprehensive log of my professional growth, technical focus, and client deliveries.
          </p>
        </div>

        {/* Vertical timeline flow */}
        <div className="relative max-w-4xl mx-auto pl-6 sm:pl-0 sm:mx-auto">
          
          {/* Central Vertical Line for Desktop / Left Line for Mobile */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-[#E2E8F0] -translate-x-1/2" />

          {/* Core Timeline Events grid */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {JOURNEY.map((stage, idx) => {
              const Icon = stage.icon;
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={stage.year} 
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Timeline Badge Dot Pin in Center */}
                  <div className="absolute left-6 sm:left-1/2 top-1.5 sm:top-auto w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center -translate-x-1/2 z-20 transition-colors hover:border-[#2563EB]">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>

                  {/* Spacer Column for matching side */}
                  <div className="hidden sm:block w-1/2" />

                  {/* Primary Narrative Card Side (1/2 width) */}
                  <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-12 relative z-10">
                    <motion.div
                      className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all duration-300 shadow-xs"
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Year Indicator Label */}
                      <span className="inline-block text-[10px] font-mono font-extrabold tracking-widest text-[#2563EB] bg-blue-50/80 px-2.5 py-1 rounded-md mb-4 uppercase">
                        {stage.year}
                      </span>
                      
                      <h4 className="text-lg font-extrabold text-[#0F172A] tracking-tight mb-1">
                        {stage.role}
                      </h4>
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 font-bold">
                        {stage.title}
                      </p>

                      <p className="text-xs text-[#334155] leading-relaxed mb-6 font-sans">
                        {stage.description}
                      </p>

                      {/* Achievements check-list points */}
                      <ul className="flex flex-col gap-2.5">
                        {stage.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex h-max items-start gap-2 text-xs text-[#0F172A] font-medium font-sans">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
