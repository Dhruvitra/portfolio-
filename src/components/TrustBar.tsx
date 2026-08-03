import { ComponentType } from 'react';
import { ShoppingBag, Box, Database, Sparkles, Layers, Terminal } from 'lucide-react';

interface BrandItem {
  name: string;
  icon: ComponentType<{ className?: string }>;
  accentColor: string;
}

const BRANDS: BrandItem[] = [
  { name: 'Shopify Plus', icon: ShoppingBag, accentColor: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  { name: 'React SPA', icon: Layers, accentColor: 'text-blue-500 bg-blue-50 border-blue-100' },
  { name: 'Node.js Express', icon: Terminal, accentColor: 'text-green-500 bg-green-50 border-green-100' },
  { name: 'MongoDB', icon: Database, accentColor: 'text-[#10B981] bg-emerald-50/50 border-emerald-100/50' },
  { name: 'Figma Dev', icon: Sparkles, accentColor: 'text-purple-500 bg-purple-50 border-purple-100' },
  { name: 'JavaScript ES6+', icon: Box, accentColor: 'text-amber-500 bg-amber-50 border-amber-100' },
];

export default function TrustBar() {
  // Triple the items to ensure seamless flow back-to-back
  const scrolledItems = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div id="trustbar" className="relative py-12 bg-[#F8FAFC] border-y border-[#E2E8F0] overflow-hidden select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
        <p className="text-[10px] md:text-xs font-mono tracking-[0.25em] font-extrabold text-[#94A3B8] uppercase">
          COMMITTED TO ADVANCED ENTERPRISE-GRADE CAPABILITIES
        </p>
      </div>

      <div className="flex overflow-hidden relative">
        <div className="flex gap-8 whitespace-nowrap animate-marquee py-2">
          {scrolledItems.map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-[#E2E8F0] shadow-xs cursor-default hover:border-slate-300 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className={`p-1.5 rounded-full ${brand.accentColor.split(' ')[1]} ${brand.accentColor.split(' ')[2]}`}>
                  <Icon className={`w-4 h-4 ${brand.accentColor.split(' ')[0]}`} />
                </div>
                <span className="text-sm font-semibold tracking-tight text-primary">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
