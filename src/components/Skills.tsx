import { useState, ComponentType } from 'react';
import { motion } from 'motion/react';
import { Layers, Terminal, Database, ShieldAlert, Sliders, Box, Figma, Smartphone, Laptop } from 'lucide-react';

interface SkillItem {
  name: string;
  level: number; // percentage
}

interface SkillCategory {
  title: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Engineering',
    icon: Laptop,
    description: 'Developing high performing, responsive client architectures.',
    skills: [
      { name: 'React 19 / JSX', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS v4', level: 100 },
      { name: 'Next.js Workflows', level: 85 },
      { name: 'Framer Motion', level: 90 },
    ],
  },
  {
    title: 'Backend Systems',
    icon: Terminal,
    description: 'Constructing ultra secure, fast servers and API contracts.',
    skills: [
      { name: 'Node.js Engine', level: 92 },
      { name: 'Express Server', level: 95 },
      { name: 'REST & GraphQL API', level: 90 },
      { name: 'OAuth Integrations', level: 88 },
      { name: 'WebSockets Node', level: 80 },
    ],
  },
  {
    title: 'Shopify Development',
    icon: Box,
    description: 'Elite custom Liquid logic and highly optimized checkouts.',
    skills: [
      { name: 'Liquid Template Engine', level: 98 },
      { name: 'Custom Theme Architecture', level: 95 },
      { name: 'Shopify Admin API & SDKs', level: 90 },
      { name: 'Checkout Customization', level: 92 },
      { name: 'Online Store 2.0 standard', level: 98 },
    ],
  },
  {
    title: 'Data & Cloud Solutions',
    icon: Database,
    description: 'Optimizing high efficiency NoSQL and transactional queries.',
    skills: [
      { name: 'MongoDB Database', level: 90 },
      { name: 'PostgreSQL DB', level: 80 },
      { name: 'Firebase Cloud Storage', level: 88 },
      { name: 'Mongoose State Control', level: 92 },
    ],
  },
  {
    title: 'UI/UX Visual Design',
    icon: Figma,
    description: 'Prototyping premium high-fidelity systems prior to coding.',
    skills: [
      { name: 'Figma Layout & Tokens', level: 90 },
      { name: 'Aesthetic Interface Design', level: 92 },
      { name: 'Interactive Typography', level: 88 },
      { name: 'Fluid Mobile UX Schemes', level: 95 },
    ],
  },
];

export default function Skills() {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number | null>(null);

  return (
    <section 
      id="skills" 
      className="relative pt-14 pb-28 bg-[#FFFFFF] border-b border-slate-100 overflow-hidden"
    >
      {/* Decorative premium design elements */}
      <div className="absolute top-24 right-1/4 w-[300px] h-[300px] bg-sky-50/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
            03 • TECH MATRIX
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Comprehensive Capabilities
          </h2>
          <p className="text-[#334155] mt-4 leading-relaxed font-sans">
            I continuously optimize my workflow to build robust codebases that balance 
            speed, scalability, and gorgeous front-end animations.
          </p>
        </div>

        {/* Master Bento Layout Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {SKILL_CATEGORIES.map((category, catIdx) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                className="relative p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-xs hover:shadow-xl transition-all duration-500 cursor-default"
                onMouseEnter={() => setActiveCategoryIdx(catIdx)}
                onMouseLeave={() => setActiveCategoryIdx(null)}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{ 
                  y: -8,
                  borderColor: 'rgba(37, 99, 235, 0.2)',
                  transition: { duration: 0.3 }
                }}
              >
                {/* 3D Depth Inner Card */}
                <div style={{ transform: 'translateZ(20px)' }}>
                  
                  {/* Category icon and title */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition-colors">
                      <Icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
                        {category.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono mt-0.5">
                        MASTERED STATE
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed mb-6 font-sans">
                    {category.description}
                  </p>

                  {/* Skills lists loops */}
                  <div className="flex flex-col gap-4">
                    {category.skills.map((skill, skillIdx) => (
                      <div key={skill.name} className="group/item">
                        <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5 font-sans">
                          <span className="group-hover/item:text-[#2563EB] transition-colors font-semibold">
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {skill.level}%
                          </span>
                        </div>
                        
                        {/* Interactive dynamic loading bar */}
                        <div className="w-full h-1.5 bg-[#F8FAFC] rounded-full overflow-hidden border border-[#E2E8F0]">
                          <motion.div
                            className="h-full bg-[#2563EB]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: catIdx * 0.1 + skillIdx * 0.05, duration: 1.2, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}

          {/* Special Bento Visual CTA Grid block */}
          <motion.div
            className="md:col-span-2 lg:col-span-1 rounded-3xl p-8 bg-[#0F172A] text-white flex flex-col justify-between border border-slate-800 relative overflow-hidden group shadow-lg"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mesh glow inside white CTA */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 font-sans">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase mb-6 border border-white/10">
                <Sliders className="w-3 h-3 text-[#2563EB] animate-pulse" />
                <span>CLEAN WORKFLOW</span>
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight mb-3">
                Need a tailored bespoke integration?
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                I regularly combine customized headless APIs inside Next.js while retaining 
                the transactional integrity of Shopify. Challenge me with complex architectures.
              </p>
            </div>

            <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8] block mb-2">
                ESTABLISHED DELIVERY STACK
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10">JWT</span>
                <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10">Tailwind V4</span>
                <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10">OAuth 2.0</span>
                <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10">Node/GraphQL</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
