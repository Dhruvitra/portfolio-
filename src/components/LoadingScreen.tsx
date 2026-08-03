import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400; // 2.4 seconds loading
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(nextProgress);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 300); // Small buffer for smooth end
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <motion.div
      id="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        filter: 'blur(20px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
      }}
    >
      <div className="relative flex flex-col items-center max-w-xs w-full px-6">
        {/* Elite circular glow behind the logo */}
        <div className="absolute -inset-10 bg-radial from-slate-100 to-transparent blur-2xl opacity-70 pointer-events-none" />

        {/* DV Luxury Typography Logo Reveal */}
        <div className="relative mb-8 text-center">
          <motion.div
            className="text-6xl font-extrabold tracking-tighter text-gradient font-sans"
            initial={{ letterSpacing: '-0.1em', opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ 
              letterSpacing: '0.05em', 
              opacity: 1, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            D<span className="text-accent">V</span>
          </motion.div>
          <motion.p
            className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-mono mt-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              transition: { delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            Dhruvik Vanol
          </motion.p>
        </div>

        {/* Apple-style Precision Loading Bar */}
        <div className="relative w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Progress Counter */}
        <motion.span 
          className="text-[11px] font-mono text-slate-400 tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>

      {/* Floating minimalistic credentials tag */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-slate-300 font-mono">
        EST. 2026 • WORKPORTFOLIO
      </div>
    </motion.div>
  );
}
