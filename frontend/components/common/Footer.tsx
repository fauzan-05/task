'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render public consumer footer on Admin Portal pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#122c20] text-stone-200 mt-20 border-t border-emerald-900/40">
      {/* Commitment Section Bar */}
      <div className="border-b border-emerald-900/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <p className="text-base sm:text-lg lg:text-xl font-serif max-w-3xl mx-auto leading-relaxed text-emerald-100/95">
          Discover our commitment to 🪵🥣 <span className="italic font-bold text-white underline decoration-emerald-500/50 decoration-2">sustainable</span> materials, low-impact production, and 🌿 <span className="italic font-bold text-white underline decoration-emerald-500/50 decoration-2">ethical sourcing</span> partnerships — all crafted to support a healthier planet and a 🍃 <span className="italic font-bold text-white underline decoration-emerald-500/50 decoration-2">greener kitchen</span>.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-stone-300">
        <div className="space-y-3">
          <span className="font-serif text-2xl font-semibold tracking-tight text-white italic">
            Homedine
          </span>
          <p className="text-stone-400 leading-relaxed">
            Thoughtful, planet-prioritizing eco kitchenware, non-toxic cookware, and sustainable dining essentials.
          </p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Explore</h4>
          <ul className="space-y-2 text-stone-400">
            <li><Link href="/products" className="hover:text-white transition-colors">Shop All Kitchenware</Link></li>
            <li><Link href="/products?category=Cookware" className="hover:text-white transition-colors">Non-toxic Cookware</Link></li>
            <li><Link href="/products?category=Drinkware" className="hover:text-white transition-colors">Reusable Drinkware</Link></li>
            <li><Link href="/products?category=Appliances" className="hover:text-white transition-colors">Eco Appliances</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Sustainability</h4>
          <ul className="space-y-2 text-stone-400">
            <li><span className="text-stone-300">100% Plastic-Free Packaging</span></li>
            <li><span className="text-stone-300">FSC Certified Bamboo</span></li>
            <li><span className="text-stone-300">Lead & Cadmium Free Glazes</span></li>
            <li><span className="text-stone-300">Carbon Neutral Delivery</span></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-2">Join the Greener Kitchen</h4>
          <p className="text-stone-400 text-[11px]">Receive monthly zero-waste recipes and seasonal product releases.</p>
          <div className="flex items-center gap-1.5">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-emerald-950/80 border border-emerald-800 text-stone-200 placeholder-stone-500 rounded-full px-3 py-1.5 text-xs flex-1 focus:outline-none focus:border-emerald-500"
            />
            <button className="w-7 h-7 rounded-full bg-white text-emerald-950 flex items-center justify-center hover:bg-stone-200 transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900/40 py-6 text-center text-[11px] text-stone-500">
        <p>&copy; {new Date().getFullYear()} Homedine Eco Kitchenware. All rights reserved.</p>
      </div>
    </footer>
  );
};
