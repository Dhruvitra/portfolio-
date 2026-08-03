import { ArrowUp, Github, Linkedin, MessageSquare, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="relative bg-white pt-24 pb-12 border-t border-[#E2E8F0] overflow-hidden select-none">
      
      {/* Decorative outline grid nodes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_60%,transparent_100%)] opacity-[0.08] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Strong Lead Capture CTA Block - Priority 5 */}
        <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 mb-16 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-900/5 select-text">
          {/* Subtle Cybernetic Grid Overlay & Glowing Radial Spot */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-[0.2] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 font-sans">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold tracking-widest uppercase rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Book a Free Consultation</span>
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Build Your Next Project?
            </h3>
            <p className="text-slate-400 text-sm md:text-base max-w-xl">
              Let's Discuss Your Requirements. No obligation, 15-minute consultation to scope your project.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => {
                // If on a sub-page, navigate back home, then scroll.
                if (window.location.pathname !== '/') {
                  window.history.pushState(null, '', '/');
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 150);
                } else {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>Let's Work Together</span>
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        
        {/* Core typography container displaying DHRUVIK VANOL */}
        <div className="w-full text-center border-b border-[#E2E8F0] pb-16 mb-12">
          <motion.h2 
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-[#0F172A] tracking-tighter opacity-15 hover:opacity-100 transition-opacity duration-500 cursor-default uppercase font-sans mb-4"
            initial={{ letterSpacing: '-0.07em' }}
            whileInView={{ letterSpacing: '-0.02em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            DHRUVIK VANOL
          </motion.h2>
          
          <p className="text-secondary tracking-[0.2em] font-mono text-[10px] sm:text-xs font-bold uppercase">
            Shopify Developer &bull; MERN Developer &bull; Full Stack Engineer
          </p>
        </div>

        {/* Action channels row */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          
          {/* Copyright description */}
          <div className="text-left md:max-w-xs font-sans">
            <h4 className="text-xs font-extrabold text-[#0F172A] tracking-tight mb-2">DHRUVIK VANOL &bull; WORKSPACE</h4>
            <p className="text-[#334155] text-[11px] leading-relaxed">
              Handcrafting premium high converting storefront architectures and solid backend node circuits.
            </p>
          </div>

          {/* Social connections links */}
          <div className="flex flex-wrap justify-center gap-4">
            
            <a 
              href="https://www.linkedin.com/in/dhruvitra-vanol-849a51321" 
              target="_blank" 
              rel="noreferrer"
              className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-full hover:bg-slate-100 hover:border-[#CBD5E1] transition-all text-secondary hover:text-[#0F172A] hover:-translate-y-1"
              aria-label="LinkedIn profile connection link"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
            </a>

            <a 
              href="mailto:dhruviktra.rajput.1379@gmail.com"
              className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-full hover:bg-slate-100 hover:border-[#CBD5E1] transition-all text-secondary hover:text-[#0F172A] hover:-translate-y-1"
              aria-label="Direct Email Link address"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
            </a>

            <a 
              href="https://wa.me/918320763694" 
              target="_blank" 
              rel="noreferrer"
              className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-full hover:bg-slate-100 hover:border-[#CBD5E1] transition-all text-secondary hover:text-[#0F172A] hover:-translate-y-1"
              aria-label="Direct WhatsApp channel connection link"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
            </a>

            <a 
              href="https://github.com/Dhruvitra"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-full hover:bg-slate-100 hover:border-[#CBD5E1] transition-all text-secondary hover:text-[#0F172A] hover:-translate-y-1"
              aria-label="Git repository workspace logs"
            >
              <Github className="w-4 h-4 text-[#0F172A]" />
            </a>

          </div>

          {/* Back to top click trigger */}
          <button
            onClick={scrollToTop}
            className="group px-5 py-3 rounded-full border border-[#E2E8F0] bg-white shadow-xs hover:border-[#CBD5E1] hover:shadow-md transition-all flex items-center gap-2 text-xs font-bold text-[#0F172A] cursor-pointer active:scale-95"
            aria-label="Scroll back up to primary view"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4 text-[#2563EB] transform group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>

        {/* Minimalist sub-footer license columns */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E2E8F0] text-[10px] text-slate-400 font-mono">
          <span>COPYRIGHT © 2026 DHRUVIK VANOL. ALL RIGHTS EXCLUDED.</span>
          <div className="flex gap-4">
            <span>TERMS & METRICS</span>
            <span className="text-secondary font-bold">LATEST DEPLOY: JUNE 2026</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
