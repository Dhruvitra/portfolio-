import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, Mail, CheckCircle2, Sparkles, ShoppingBag, Atom, Server, Database, Figma, FileText, ChevronRight } from 'lucide-react';
import profileImg from '../assets/profile.png';

interface HeroProps {
  onContactClick: () => void;
  onViewWorkClick: () => void;
}

const ROLES = [
  'Full Stack Developer',
  'Next.js Developer',
  'Shopify Expert',
  'MERN Stack Engineer',
  'n8n Automation Expert',
];

export default function Hero({ onContactClick, onViewWorkClick }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalMouse = useRef({ x: 0, y: 0, active: false });

  // Rotate roles with slide + fade
  useEffect(() => {
    // Standard robust interval
    const timer = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // HTML5 Interactive Grid Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number, y: number, r: number, vx: number, vy: number, alpha: number }> = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const density = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 40);
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 1,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const drawGridAndParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid points
      const gridSize = 64;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw interactive soft mouse spotlight blur representation
      if (globalMouse.current.active) {
        const radGrad = ctx.createRadialGradient(
          globalMouse.current.x, globalMouse.current.y, 0,
          globalMouse.current.x, globalMouse.current.y, 350
        );
        radGrad.addColorStop(0, 'rgba(37, 99, 235, 0.055)');
        radGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.0125)');
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Render drifting particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawGridAndParticles);
    };

    drawGridAndParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Framer Motion spring values for responsive buttery-smooth 3D Hover Tilt & Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 45, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 45, stiffness: 180 });

  // Transforms for full container 3D tilting
  const tiltX = useTransform(springY, [-250, 250], [10, -10]);
  const tiltY = useTransform(springX, [-250, 250], [-10, 10]);

  // Transforms for parallax displacements on floating badges
  const paraShopifyX = useTransform(springX, [-250, 250], [-12, 12]);
  const paraShopifyY = useTransform(springY, [-250, 250], [-12, 12]);

  const paraReactX = useTransform(springX, [-250, 250], [15, -15]);
  const paraReactY = useTransform(springY, [-250, 250], [-15, 15]);

  const paraNodeX = useTransform(springX, [-250, 250], [-14, 14]);
  const paraNodeY = useTransform(springY, [-250, 250], [14, -14]);

  const paraFigmaX = useTransform(springX, [-250, 250], [12, -12]);
  const paraFigmaY = useTransform(springY, [-250, 250], [-12, 12]);

  const paraMongoX = useTransform(springX, [-250, 250], [-8, 8]);
  const paraMongoY = useTransform(springY, [-250, 250], [8, -8]);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    mouseX.set(x);
    mouseY.set(y);

    // Update global Canvas spotlight coordinates
    const section = document.getElementById('hero');
    if (section) {
      const secRect = section.getBoundingClientRect();
      globalMouse.current = {
        x: e.clientX - secRect.left,
        y: e.clientY - secRect.top,
        active: true
      };
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    globalMouse.current.active = false;
  };



  return (
    <section 
      id="hero" 
      className="relative min-h-screen py-24 flex items-center justify-center bg-white overflow-hidden"
    >
      {/* HTML5 Canvas Background pattern */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />

      {/* Floating Ambient Aurora Glass Orbs (Apple-Stripe luxury glow) */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-blue-50/50 via-sky-50/10 to-transparent blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-violet-50/40 via-blue-50/10 to-transparent blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 pt-10">
        
        {/* LEFT-SIDE TYPOGRAPHY COLUMN (7 columns) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-center text-left">
          
          {/* Subtle Accent Intro Tag */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100/70 rounded-full w-max text-[11px] font-extrabold text-[#2563EB] uppercase tracking-widest mb-6 shadow-2xs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
            <span>HELLO, I'M DHRUVIK VANOL</span>
          </motion.div>

          {/* Huge typography premium-styled header */}
          <h1 className="leading-[1.0] mb-5 tracking-tighter">
            <motion.span 
              className="block text-[#0F172A] text-xs font-mono tracking-[0.3em] font-extrabold mb-3 uppercase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              HELLO, I'M
            </motion.span>
            <motion.span 
              className="block text-[54px] sm:text-[76px] md:text-[88px] font-extrabold text-[#0F172A] tracking-tighter"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              DHRUVIK
            </motion.span>
            <motion.span 
              className="block text-[54px] sm:text-[76px] md:text-[88px] font-extrabold text-[#2563EB] tracking-tighter text-gradient-accent"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              VANOL
            </motion.span>
          </h1>

          {/* Dynamic slide-in Role Title */}
          <motion.div 
            className="h-12 overflow-hidden relative flex items-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-2xl font-extrabold font-mono text-[#0F172A] uppercase tracking-wider block"
              >
                // <span className="text-[#2563EB]">{ROLES[roleIndex]}</span>
              </motion.span>
            </AnimatePresence>
            <span className="w-[3px] h-6 bg-[#2563EB] ml-2 animate-[ping_1.2s_infinite]" />
          </motion.div>

          {/* Luxury Positioning Introduction */}
          <motion.p 
            className="text-lg md:text-[19px] text-[#334155] leading-relaxed max-w-[530px] mb-10 font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            I build <span className="text-[#0F172A] font-extrabold border-b border-[#2563EB]/45 pb-0.5">premium digital products</span>, high-converting Shopify stores, scalable Next.js web applications, and sophisticated MERN stack solutions for startups and enterprises globally.
          </motion.p>

          {/* Supreme call-to-action bar */}
          <motion.div 
            className="flex flex-wrap items-center gap-4.5 mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <button
              onClick={onViewWorkClick}
              aria-label="View Full Stack Developer and Shopify Expert Projects"
              className="px-8 py-4 bg-[#0F172A] text-white hover:bg-black rounded-full font-bold transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm active:scale-97"
            >
              <span>View Projects</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={onContactClick}
              aria-label="Contact Dhruvik Vanol for Freelance Web Development"
              className="px-8 py-4 bg-[#2563EB] text-white hover:bg-blue-700 rounded-full font-bold transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm shadow-blue-100 active:scale-97"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Hire Me</span>
            </button>
          </motion.div>

          {/* Availability Status & Roles Checklist - Priority 2 */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-slate-100 mt-4 font-sans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {/* Available for freelance work green badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full w-max text-xs font-bold shadow-2xs select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available For Freelance Work</span>
            </div>

            {/* Dynamic Sub-roles check panel */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Shopify Expert
              </span>
              <span className="text-slate-350 font-light">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Next.js & MERN
              </span>
              <span className="text-slate-350 font-light">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Web Developer India
              </span>
            </div>
          </motion.div>

        </div>

        {/* RIGHT-SIDE LUXURY PORTRAIT CANVAS FRAME (5 columns) */}
        <div className="lg:col-span-12 xl:col-span-5 flex justify-center items-center w-full relative">
          
          <motion.div
            id="workspace-container"
            className="relative w-full max-w-[420px] aspect-square rounded-full cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: 'preserve-3d',
              perspective: 1000
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 80, delay: 0.8 }}
          >
            
            {/* Spinning glowing double border halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2563EB]/40 via-blue-200/50 to-emerald-400/40 blur-lg animate-pulse" />
            
            <motion.div
              className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-[#2563EB] via-indigo-400 to-emerald-400 opacity-80"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner frame white space buffer (with overflow-hidden container) */}
            <div className="absolute inset-0.5 rounded-full bg-white p-2.5 flex items-center justify-center relative overflow-hidden backdrop-blur-3xl shadow-2xl shadow-blue-50/50">
              
              {/* Actual premium high-resolution photo from Unsplash fitting corporate luxury branding */}
              <img
                src={profileImg}
                alt="Dhruvik Vanol Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />

            </div>

            {/* Glassmorphism subtle layout banner frame overlay on bottom of the image (placed outside overflow-hidden) */}
            <div 
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] px-5 py-3 rounded-2xl glass-panel border border-white/40 flex items-center justify-between shadow-lg z-10"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
            >
              <div>
                <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">CORE ENGINEER</h4>
                <p className="text-xs font-extrabold text-[#0F172A]">Dhruvik Vanol v2.0</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* FLOATING TECHNOLOGY BADGES BOUND TO MOUSE PARALLAX DISPLACEMENTS */}
            
            {/* Badge 1: Shopify (ShoppingBag) - Top Left */}
            <motion.div
              className="absolute -top-4 -left-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-lg flex items-center gap-2"
              style={{
                x: paraShopifyX,
                y: paraShopifyY,
                transform: 'translateZ(55px)'
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-mono">Shopify</span>
            </motion.div>

            {/* Badge 2: React (Atom) - Top Right */}
            <motion.div
              className="absolute -top-2 -right-6 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-blue-100 shadow-lg flex items-center gap-2"
              style={{
                x: paraReactX,
                y: paraReactY,
                transform: 'translateZ(65px)'
              }}
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.3 }}
            >
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <Atom className="w-3.5 h-3.5 text-[#2563EB] animate-[spin_8s_infinite_linear]" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-mono">React v19</span>
            </motion.div>

            {/* Badge 3: Node.js (Server) - Middle Left */}
            <motion.div
              className="absolute top-1/2 -left-12 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-indigo-50 shadow-lg flex items-center gap-2"
              style={{
                x: paraNodeX,
                y: paraNodeY,
                transform: 'translateZ(50px)'
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.6 }}
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Server className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-mono">Node.js</span>
            </motion.div>

            {/* Badge 4: Figma (Figma) - Bottom Left */}
            <motion.div
              className="absolute -bottom-2 -left-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100 shadow-lg flex items-center gap-2"
              style={{
                x: paraFigmaX,
                y: paraFigmaY,
                transform: 'translateZ(60px)'
              }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.9 }}
            >
              <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center">
                <Figma className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-mono">Figma</span>
            </motion.div>

            {/* Badge 5: MongoDB (Database) - Bottom Right */}
            <motion.div
              className="absolute bottom-6 -right-10 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-teal-100 shadow-lg flex items-center gap-2"
              style={{
                x: paraMongoX,
                y: paraMongoY,
                transform: 'translateZ(45px)'
              }}
              animate={{ y: [0, -11, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.2 }}
            >
              <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-mono">MongoDB</span>
            </motion.div>

          </motion.div>
        </div>

      </div>

      {/* Slide-down interactive visual anchor */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-10" onClick={onViewWorkClick}>
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#64748B] uppercase font-bold">Explore Masterwork</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-[#2563EB]" />
        </motion.div>
      </div>



    </section>
  );
}
