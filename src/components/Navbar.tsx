import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Award } from 'lucide-react';

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { label: 'Work', id: 'projects' },
    { label: 'Biography', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Services', id: 'services' },
    { label: 'Journey', id: 'experience' },
    { label: 'Endorsements', id: 'testimonials' },
  ];

  return (
    <>
      <motion.header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'py-3.5 px-6 md:px-12 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs' 
            : 'py-5 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]'
        }`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo element */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#0F172A] text-white flex items-center justify-center font-extrabold text-lg rounded-lg shadow-sm font-sans tracking-tight transition-all duration-300 group-hover:bg-[#2563EB]">
              <span>DV</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-[#0F172A] transition-colors group-hover:text-[#2563EB]">
                DHRUVIK VANOL
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#64748B] uppercase">
                Shopify & MERN Engineer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => selectSection(item.id)}
                className="px-4 py-1.5 rounded-md text-[13px] font-medium text-[#334155] hover:text-[#2563EB] transition-all duration-200 relative group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
              </button>
            ))}
          </nav>

          {/* Availability Indicator & Action */}
          <div className="hidden sm:flex items-center gap-5">
            <button
              onClick={onContactClick}
              className="px-5 py-2.5 bg-[#0F172A] text-white rounded-full text-xs font-extrabold hover:bg-[#2563EB] hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Book a Call</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Responsive Mobile burger */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-full border border-[#E2E8F0] sm:hidden">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
              </span>
              <span className="text-[9px] font-mono text-[#10B981] font-bold uppercase tracking-widest">
                HIRE
              </span>
            </div>
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            className="fixed inset-0 z-30 bg-white pt-24 px-6 pb-8 flex flex-col justify-between lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-6">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest border-b border-rose-50/10 pb-2">
                Discover Portfolio
              </div>
              <div className="flex flex-col gap-3">
                {menuItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    onClick={() => selectSection(item.id)}
                    className="text-left py-2 text-2xl font-bold text-primary hover:text-accent transition-colors flex items-center justify-between group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: idx * 0.05 + 0.1 } 
                    }}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-accent transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-slate-500">Dhruvik represents high scale business delivery</span>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactClick();
                }}
                className="w-full py-4 rounded-xl font-bold bg-primary text-white text-center hover:bg-accent transition-all duration-300"
              >
                Let's Partner Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
