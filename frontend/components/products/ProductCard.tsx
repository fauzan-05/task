'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const isOutOfStock = product.stock <= 0;

  const defaultColors = product.colors && product.colors.length > 0
    ? product.colors
    : ['#8ecae6', '#a7c957', '#2a9d8f'];

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-stone-200/70 hover:border-stone-300 hover:shadow-md transition-all group">
      {/* Top Image & Badge Container */}
      <Link
        href={`/products/${product._id}`}
        className="relative aspect-square w-full rounded-xl bg-[#f2efe9] overflow-hidden block mb-3.5 group-hover:opacity-95 transition-opacity"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Badge (Promotion / New / Customer Favorite) */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-white/90 backdrop-blur-md text-stone-700 shadow-sm border border-stone-100">
              {product.badge}
            </span>
          </div>
        )}

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {defaultColors.map((hex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  selectedColor === idx ? 'scale-125 ring-1.5 ring-stone-900 ring-offset-1' : 'opacity-85 hover:scale-110'
                }`}
                style={{ backgroundColor: hex }}
                aria-label={`Color ${idx + 1}`}
              />
            ))}
          </div>

          {/* Product Name Title */}
          <Link href={`/products/${product._id}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-emerald-950 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Shop now Button (Navigates to Product Details) */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
          <span className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            {formatCurrency(product.price)}
          </span>

          <Link
            href={`/products/${product._id}`}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-sm bg-emerald-950 text-white hover:bg-emerald-900 active:scale-95 group/btn"
          >
            <span>Shop now</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
