import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

interface Testimonial {
  text: string;
  author: string;
  company: string;
  role: string;
  rating: number;
  initials: string;
  bgGlow: string;
  sourceType: 'client' | 'internship' | 'college' | 'github';
  sourceLabel: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Dhruvik is a rare talent in Shopify engineering. He took our legacy Liquid template and rebuilt it into a fluid, customized storefront. Our mobile checkout conversion speed instantly doubled, and our conversion rate went up by 35% in under 3 weeks.",
    author: "Richard S.",
    company: "Chic & Thread Co.",
    role: "Founder & Creative Director",
    rating: 5,
    initials: "RS",
    bgGlow: "from-emerald-50 to-emerald-100/10",
    sourceType: 'client',
    sourceLabel: 'Verified Client',
  },
  {
    text: "Verifying our databases and implementing JWT auth on our Express server was completed ahead of schedule. Dhruvik designed our admin panels and REST loops with pristine code quality. He is incredibly professional, responsive, and direct.",
    author: "Evelyn M.",
    company: "Apex Dashboard Panels",
    role: "VP of Product Development",
    rating: 5,
    initials: "EM",
    bgGlow: "from-blue-50 to-blue-100/10",
    sourceType: 'client',
    sourceLabel: 'Verified Client',
  },
  {
    text: "Dhruvik designed and coded our marketing landing page. The animations are clean, fluid, and run at 60 FPS on both mobile and widescreen browsers. It is rare to find a developer who understands typography, pixel perfect grids, and low latency backend routes.",
    author: "Arjun R.",
    company: "Nova AI Analytics",
    role: "Principal Product Owner",
    rating: 5,
    initials: "AR",
    bgGlow: "from-indigo-50 to-slate-100/10",
    sourceType: 'client',
    sourceLabel: 'Verified Client',
  },
  {
    text: "Dhruvik completed our final year college project — a full MERN CRM system — with exceptional code quality, clear documentation, and a beautiful UI. He delivered the entire module 2 weeks ahead of our submission deadline.",
    author: "Prof. Kiran Shah",
    company: "Government Engineering College, Surat",
    role: "Project Mentor & Faculty",
    rating: 5,
    initials: "KS",
    bgGlow: "from-violet-50 to-violet-100/10",
    sourceType: 'college',
    sourceLabel: 'College Project Feedback',
  },
  {
    text: "During his internship with us, Dhruvik built a complete Shopify theme customization tool with a live preview panel. His initiative, attention to detail, and speed of execution far exceeded what we expected from an intern.",
    author: "Priya Mehta",
    company: "DigitalCraft Agency, Ahmedabad",
    role: "Lead Developer & Intern Supervisor",
    rating: 5,
    initials: "PM",
    bgGlow: "from-amber-50 to-amber-100/10",
    sourceType: 'internship',
    sourceLabel: 'Internship Feedback',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setIndex(prev => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[index];

  // Framer Motion sliders configs
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <section 
      id="testimonials" 
      className="relative py-28 bg-white border-b border-[#E2E8F0] overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-50/40 via-white to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title Block */}
        <div className="max-w-xl text-left mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-[#2563EB] uppercase font-bold block mb-3">
            06 • REVIEWS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Client Endorsements
          </h2>
          <p className="text-[#334155] mt-4 leading-relaxed font-sans">
            Real feedback from modern business owners who trusted my design execution and technical consulting.
          </p>
        </div>

        {/* Client Trust Results Grid - Priority 3 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto font-sans">
          <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-2xl font-black text-emerald-600 block tracking-tight">100%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1 font-mono">Client Satisfaction</span>
          </div>
          <div className="bg-blue-50/40 border border-blue-100/80 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-2xl font-black text-blue-600 block tracking-tight">+35%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1 font-mono">Avg Conversion Lift</span>
          </div>
          <div className="bg-amber-50/40 border border-amber-100/80 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-2xl font-black text-amber-600 block tracking-tight">Sub-1s</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1 font-mono">Average Page Load</span>
          </div>
          <div className="bg-[#EEF2F6]/60 border border-slate-200/80 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-2xl font-black text-slate-800 block tracking-tight">5-Star</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1 font-mono">Average Rating</span>
          </div>
        </div>

        {/* Apple style Carousel display card */}
        <div className="relative max-w-4xl mx-auto rounded-3xl border border-[#E2E8F0] bg-white p-8 md:p-12 shadow-md">
          
          {/* Animated background highlights */}
          <div className="absolute inset-0 bg-radial from-slate-50/20 to-transparent pointer-events-none rounded-3xl" />

          {/* Quote mark decorator */}
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
            <Quote className="w-5 h-5 text-[#2563EB]" />
          </div>

          <div className="relative h-auto min-h-[220px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Source type badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-widest border mb-5 ${
                    currentTestimonial.sourceType === 'client'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : currentTestimonial.sourceType === 'internship'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : currentTestimonial.sourceType === 'college'
                      ? 'bg-violet-50 text-violet-600 border-violet-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {currentTestimonial.sourceLabel}
                  </span>

                  {/* Performance stars rating panel */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold ml-2">VERIFIED PARTNER REVENUE MATCH</span>
                  </div>

                  <blockquote className="text-base md:text-lg text-[#0F172A] leading-relaxed font-extrabold tracking-tight mb-8">
                    "{currentTestimonial.text}"
                  </blockquote>
                </div>

                {/* Testimonial Author details */}
                <div className="flex items-center gap-4 pt-6 border-t border-[#E2E8F0]">
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] text-white font-mono text-sm font-bold flex items-center justify-center shadow-sm">
                    {currentTestimonial.initials}
                  </div>
                  <div className="font-sans">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-[#0F172A]">
                        {currentTestimonial.author}
                      </h4>
                      <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-xs text-[#64748B] font-bold">
                      {currentTestimonial.role} — <span className="text-[#2563EB] font-bold">{currentTestimonial.company}</span>
                    </p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sliding indicators buttons */}
          <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 flex items-center gap-2">
            <button
              id="testimonial-prev-button"
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-[#E2E8F0] text-slate-450 hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors bg-white cursor-pointer shadow-2xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="testimonial-next-button"
              onClick={handleNext}
              className="p-2.5 rounded-full border border-[#E2E8F0] text-slate-450 hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors bg-white cursor-pointer shadow-2xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === i ? 'bg-[#0F172A] w-4' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
