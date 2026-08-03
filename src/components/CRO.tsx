import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MessageCircle, PhoneCall } from 'lucide-react';

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white p-3 rounded-full shadow-2xl border border-slate-200"
        >
          <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors">
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
          <button 
            onClick={() => {
              window.history.pushState(null, '', '/');
              setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 100);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            <PhoneCall className="w-5 h-5" /> Book Consultation
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Wait! Don't leave empty handed.</h2>
              <p className="text-slate-600 mb-6 text-sm">
                Book a free 15-minute architecture audit. I'll personally review your stack and identify critical SEO & Performance bottlenecks.
              </p>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  window.open('https://calendly.com/your-calendly-link', '_blank');
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Schedule Free Audit
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 mt-2 text-slate-500 font-semibold hover:text-slate-700 text-sm"
              >
                No thanks, I don't want 100/100 performance
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
