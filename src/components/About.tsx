import { useEffect, useState, useRef, ReactNode, MouseEvent } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Award, Briefcase, Zap, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';
import profileImg from '../assets/profile.png';

// Technology circular logo SVGs for orbiting layout
const JsLogo = () => (
  <div className="w-8 h-8 bg-[#F7DF1E] text-black font-extrabold flex items-end justify-end p-0.5 rounded shadow-md text-[10px] font-sans select-none border border-[#E2E8F0]">
    JS
  </div>
);

const TsLogo = () => (
  <div className="w-8 h-8 bg-[#3178C6] text-white font-extrabold flex items-end justify-end p-0.5 rounded shadow-md text-[10px] font-sans select-none border border-[#E2E8F0]">
    TS
  </div>
);

const ReactLogo = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0]">
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 fill-none stroke-[#00d8ff] stroke-[1.2] animate-[spin_8s_infinite_linear]">
      <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
      <g stroke="#00d8ff">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  </div>
);

const NodeLogo = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0] p-1.5">
    <svg viewBox="0 0 24 24" className="w-full h-full fill-[#339933]">
      <path d="M12 2.658l-8.25 4.764v9.526L12 21.712l8.25-4.764v-9.526zm0 1.706l6.75 3.897v7.794L12 19.952l-6.75-3.897v-7.794zm-1.5 3.398v4.5l-3-1.732v-2.258l3-1.732v1.222zm3 1.732v2.258l-3 1.732v-4.5l3-1.732v1.222zm3 1.732v1.732l-3 1.732v-3.464zm-9 0v1.732l-3 1.732v-3.464z"/>
    </svg>
  </div>
);

const MongodbIcon = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0] p-1.5">
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M17.19 10.22c-.67-2.61-2.18-4.9-4.1-6.72a.43.43 0 0 0-.6-.02C10.7 5.25 9.25 7.5 8.57 10.08c-.78 2.96-.54 5.99.64 8.78.13.3.3.6.47.88a.38.38 0 0 0 .59.08c.55-.47.93-1.07 1.15-1.76.22-.68.22-1.42.22-2.17 0-1.39-.06-2.78-.1-4.17-.02-.57-.03-1.14-.03-1.71a.38.38 0 0 1 .73-.13c.04.14.07.28.1.42.19.98.37 1.95.53 2.93.18 1.1.28 2.22.33 3.33a4.7 4.7 0 0 1-.22 1.48c-.2.6-.5 1.16-.9 1.63a.35.35 0 0 0 .1.52c.98.54 2.11.83 3.26.83.67 0 1.34-.1 2-.28a.35.35 0 0 0 .23-.44c-.75-2.9-1.28-5.88-1.63-8.88zm-5.32-8.1a.34.34 0 0 0-.44.25c-.28 1.2-.55 2.4-.81 3.61a.34.34 0 0 0 .26.4c.16.03.3-.08.33-.24.26-1.18.52-2.37.78-3.56a.34.34 0 0 0-.12-.46z" fill="#47A248" />
    </svg>
  </div>
);

const LaravelIcon = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0] p-1.5">
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="#FF2D20" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </div>
);

const PythonIcon = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0] p-1.5">
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <path d="M12.012 0C5.544 0 5.86 2.805 5.86 2.805l.006 2.9h6.148V6.82H3.456S0 7.214 0 13.568c0 6.353 3.033 6.096 3.033 6.096h1.808v-2.527s-.066-3.02 2.97-3.02h6.183s2.955-.05 2.955-2.905v-5.46S17.37 0 12.012 0zm-2.88 1.838a.862.862 0 1 1 0 1.724.862.862 0 0 1 0-1.724z" fill="#3776AB" />
      <path d="M11.988 24c6.468 0 6.152-2.805 6.152-2.805l-.006-2.9H11.986V17.18h8.558s3.456-.394 3.456-6.748c0-6.354-3.033-6.096-3.033-6.096h-1.808v2.527s.066 3.02-2.97 3.02h-6.183s-2.955.05-2.955 2.905v5.46S8.63 24 11.988 24zm2.88-1.838a.862.862 0 1 1 0-1.724.862.862 0 0 1 0 1.724z" fill="#FFD43B" />
    </svg>
  </div>
);

const PhpIcon = () => (
  <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0] p-1">
    <div className="w-full h-[18px] bg-[#777BB4] rounded-full text-white font-extrabold flex items-center justify-center text-[9px] font-mono tracking-tight select-none">
      PHP
    </div>
  </div>
);

interface OrbitItemProps {
  radius: number;
  initialAngle: number;
  duration: number;
  label: string;
  icon: ReactNode;
}

function OrbitItem({ radius, initialAngle, duration, label, icon }: OrbitItemProps) {
  return (
    <motion.div
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
      initial={{ rotate: initialAngle }}
      animate={{ rotate: initialAngle + 360 }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      <motion.div
        className="absolute top-0 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer"
        initial={{ rotate: -initialAngle }}
        animate={{ rotate: -(initialAngle + 360) }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        whileHover={{ scale: 1.18, filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.3))' }}
      >
        {/* Icon Badge */}
        {icon}
        {/* Label */}
        <span className="text-[8px] font-extrabold text-slate-500 font-sans mt-0.5 bg-white/90 px-1 rounded-xs shadow-2xs border border-slate-100/50">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  { value: 10, suffix: '+', label: 'Launch Successes', sublabel: 'Shopify & Custom Web Stores' },
  { value: 100, suffix: '%', label: 'Mobile Responsive', sublabel: 'Fluid UI across all displays' },
  { value: 100, suffix: '%', label: 'Satisfied Customers', sublabel: 'Clean communication standard' },
  { value: 5, suffix: '+', label: 'MERN & Node Systems', sublabel: 'Highly specialized setups' },
];

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // 3D Parallax Hover Tilt spring/transforms
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const tiltX = useTransform(springY, [-200, 200], [8, -8]);
  const tiltY = useTransform(springX, [-200, 200], [-8, 8]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      id="about" 
      className="relative pt-28 pb-14 bg-white border-b border-slate-100 overflow-hidden"
      ref={containerRef}
    >
      {/* Background visual rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-slate-100/60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title Grid Info */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
              01 • ORIGIN STORY
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Crafting Digital Products <br />
              With Professional Pride
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#334155] text-base md:text-lg leading-relaxed max-w-xl font-sans">
              I am Dhruvik Vanol, a dedicated <strong>Full Stack Developer</strong> and <strong>Shopify Expert</strong> based in Ahmedabad. 
              My methodology pairs technical engineering precision with clean aesthetic design.
            </p>
          </div>
        </div>

        {/* Binary split layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT SIDE: Professional portrait representation & Floating metrics board */}
          <div className="lg:col-span-5 relative">
            <motion.div
              className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-sm bg-white border border-[#E2E8F0] p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
                perspective: 1000
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Geometric modern aesthetic abstract background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-white to-blue-50/10" style={{ transform: 'translateZ(-30px)' }} />
              <div className="absolute top-12 right-12 w-24 h-24 rounded-full border border-slate-200/50 pointer-events-none" style={{ transform: 'translateZ(-25px)' }} />
              <div className="absolute bottom-8 left-8 w-44 h-44 rounded-full bg-radial from-slate-200/20 to-transparent blur-xl pointer-events-none" style={{ transform: 'translateZ(-25px)' }} />

              {/* Animated Orb and Code Canvas */}
              <div className="absolute inset-0 w-full h-[85%] overflow-hidden pointer-events-none select-none z-0" style={{ transformStyle: 'preserve-3d' }}>
                {/* Code Snippets with Drift Animations */}
                <motion.div 
                  className="absolute top-[4%] left-[4%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  {`.btn {
  padding: 10px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
}`}
                </motion.div>
                <motion.div 
                  className="absolute top-[2%] right-[10%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 }}
                >
                  {`const btn = document.
getElementById('btn');
btn.addEventListener('click',
() => {
  console.log("Clicked!");
});`}
                </motion.div>
                <motion.div 
                  className="absolute top-[20%] left-[4%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, -4, 0], x: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                >
                  {`def greet(name):
  return f"Hello, {name}"
print(greet("Dev"))`}
                </motion.div>
                <motion.div 
                  className="absolute top-[22%] right-[2%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, 6, 0], x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1.5 }}
                >
                  {`function App() {
  return (
    <div className="App">
      <h1>Hello React</h1>
    </div>
  );
}`}
                </motion.div>
                <motion.div 
                  className="absolute top-[45%] left-[2%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut", delay: 2 }}
                >
                  {`<!DOCTYPE html>
<html>
<head>
  <title>Dhruvik</title>
</head>
</html>`}
                </motion.div>
                <motion.div 
                  className="absolute top-[48%] right-[4%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, 4, 0], x: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 2.5 }}
                >
                  {`const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello Node');
});
app.listen(3000);`}
                </motion.div>
                <motion.div 
                  className="absolute top-[68%] left-[4%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, -6, 0], x: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 3 }}
                >
                  {`SELECT * FROM users
WHERE role = 'developer';`}
                </motion.div>
                <motion.div 
                  className="absolute top-[75%] right-[6%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, 5, 0], x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 8.2, ease: "easeInOut", delay: 3.5 }}
                >
                  {`interface Developer {
  name: string;
  skills: string[];
}`}
                </motion.div>
                <motion.div 
                  className="absolute top-[80%] left-[20%] opacity-15 font-mono text-[7px] text-slate-400 leading-tight text-left"
                  style={{ transform: 'translateZ(-15px)' }}
                  animate={{ y: [0, -5, 0], x: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 9.5, ease: "easeInOut", delay: 4 }}
                >
                  {`{
  "name": "Dhruvik",
  "role": "Developer",
  "skills": ["Shopify"]
}`}
                </motion.div>

                {/* Concentric Dashed Rings rotating slowly in opposite directions */}
                <motion.div 
                  className="absolute w-[160px] h-[160px] rounded-full border border-dashed border-slate-200/70 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ transform: 'translateZ(10px)' }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                />
                <motion.div 
                  className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-slate-200/50 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ transform: 'translateZ(10px)' }}
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
                />
                <motion.div 
                  className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-slate-200/35 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ transform: 'translateZ(10px)' }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                />

                {/* Orbiting Icons */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}>
                  {/* Inner Ring Items */}
                  <OrbitItem radius={80} initialAngle={0} duration={35} label="JavaScript" icon={<JsLogo />} />
                  <OrbitItem radius={80} initialAngle={120} duration={35} label="React" icon={<ReactLogo />} />
                  <OrbitItem radius={80} initialAngle={240} duration={35} label="MongoDB" icon={<MongodbIcon />} />

                  {/* Middle Ring Items */}
                  <OrbitItem radius={120} initialAngle={60} duration={45} label="Node.js" icon={<NodeLogo />} />
                  <OrbitItem radius={120} initialAngle={180} duration={45} label="TypeScript" icon={<TsLogo />} />
                  <OrbitItem radius={120} initialAngle={300} duration={45} label="Laravel" icon={<LaravelIcon />} />

                  {/* Outer Ring Items */}
                  <OrbitItem radius={160} initialAngle={0} duration={55} label="Python" icon={<PythonIcon />} />
                  <OrbitItem radius={160} initialAngle={180} duration={55} label="PHP" icon={<PhpIcon />} />
                </div>
              </div>

              {/* Graphic Overlay of Dhruvik Portrait & Text with depth */}
              <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto" style={{ transform: 'translateZ(45px)' }}>
                <img
                  src={profileImg}
                  alt="Dhruvik Vanol"
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white bg-slate-100"
                />
              </div>

              <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-full text-center z-30 pointer-events-none" style={{ transform: 'translateZ(30px)' }}>
                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Dhruvik Vanol</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-[0.2em] font-extrabold">
                  Premium Shopify & MERN Developer
                </p>
              </div>

              {/* Low key status display bar with depth */}
              <div className="relative z-10 flex justify-between items-center text-xs text-slate-500 font-mono border-t border-[#E2E8F0] pt-4" style={{ transform: 'translateZ(25px)' }}>
                <span>ESTABLISHED 2021</span>
                <span>BASED IN INDIA</span>
              </div>

              {/* Float Glass card showing experience with depth */}
              <motion.div 
                className="absolute right-4 bottom-12 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow z-30"
                style={{ transform: 'translateZ(60px)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">EXPERIENCE</h4>
                  <p className="text-sm font-extrabold text-[#0F172A]">1+ Years Industry</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Rich story breakdown and grid-based counter animations */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              My Mission is simple: elevate businesses into premium digital platforms.
            </h3>
            
            <p className="text-[#334155] leading-relaxed mb-6">
              With a primary specialization as a <strong>Freelance Shopify Developer</strong> and <strong>React Developer</strong>, 
              I design custom digital storefronts and web products that stand out. 
              My solutions prioritize high-speed Core Web Vitals performance, clean architectural semantics, and flawless cross-device responsive rendering.
            </p>

            <p className="text-[#475569] leading-relaxed mb-8">
              Whether coding highly granular Liquid custom features, implementing scalable <strong>MERN Stack</strong> dashboards, 
              or developing modern React and <strong>Next.js</strong> workflows, I provide end-to-end technical expertise for businesses worldwide.
            </p>

            {/* Structured Value Pillars ("Why Hire Me" Core Attributes) */}
            <div className="mb-10 font-sans">
              <h4 className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block mb-4.5 font-extrabold">WHY CHOOSE PARTNERSHIP WITH ME</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">10+ Masterworks Launched</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">High-converting stores and scalable custom apps.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">100% Liquid Responsive</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Fluid presentation across screens and viewport bounds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">Fast Execution Delivery</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Prompt milestones with systematic timeline releases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">SEO & Performance Standard</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Lighthouse score priorities and schema markups.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">Awwwards UX/UI Philosophy</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Refined interactive spacing, margins, and curves.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-slate-50/50 hover:bg-slate-50 p-4.5 rounded-2xl border border-slate-100 transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#0F172A]">Client-Centric Collaboration</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Clear transparency updates and continuous feedback lines.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Counters Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
              {STATS.map((stat, index) => (
                <div key={index} className="flex flex-col text-left">
                  <div className="flex items-baseline mb-1">
                    <Counter value={stat.value} suffix={stat.suffix} trigger={isInView} />
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] mb-1">{stat.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide leading-normal">{stat.sublabel}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// Custom Counter Helper Component for high fidelity numeric reveal
function Counter({ value, suffix, trigger }: { value: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 1500; // 1.5s animation
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, trigger]);

  return (
    <span className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight font-mono">
      {count}
      <span className="text-[#2563EB]">{suffix}</span>
    </span>
  );
}
