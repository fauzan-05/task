'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sparkles,
  Star,
  Quote,
  RefreshCw,
  Plus,
  Check
} from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';

// 4 Tall Explore Category Cards
const EXPLORE_CATEGORIES = [
  {
    id: 'cupeco',
    title: 'Explore\nCupEco',
    category: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    link: '/products?category=Drinkware'
  },
  {
    id: 'spoonery',
    title: 'Explore\nEcoSpoonery',
    category: 'Tableware',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80',
    link: '/products?category=Tableware'
  },
  {
    id: 'naturesip',
    title: 'Explore\nNatureSip',
    category: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    link: '/products?category=Drinkware'
  },
  {
    id: 'freshpitcher',
    title: 'Explore\nFreshPitcher',
    category: 'Drinkware',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    link: '/products?category=Drinkware'
  }
];

// Gallery Inspiration Items
const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'Sustainable Pure Scent Wax',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80'
  },
  {
    id: 'g2',
    title: 'Grain Slice Round Tray',
    image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&q=80'
  },
  {
    id: 'g3',
    title: 'Non-toxic Ceramic Pot',
    image: 'https://images.unsplash.com/photo-1584990347449-3995817c936a?w=600&q=80'
  },
  {
    id: 'g4',
    title: 'Olive Pot Ceramic',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80'
  },
  {
    id: 'g5',
    title: 'EveryDay Ceramic Cup',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'
  }
];

// Customer Testimonials
const TESTIMONIALS = [
  {
    quote: "Homedine's glass jars are awesome for storage, and the bamboo utensils are perfect for daily use!",
    author: 'Jane Cooper',
    role: 'Nutritionist'
  },
  {
    quote: 'Fantastic products and fast delivery. My kitchen feels so much greener and cleaner!',
    author: 'Darlene Robertson',
    role: 'Culinary Enthusiast'
  },
  {
    quote: "Love Homedine's eco-style! Glass jars keep things fresh, and bamboo utensils are so chic.",
    author: 'Janelle James',
    role: 'Food Blogger'
  },
  {
    quote: 'The quality is unmatched. My bamboo utensil set is durable, sustainable, and wonderful for daily use.',
    author: 'Esther Howard',
    role: 'Sous Chef'
  }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Horizontal scroll refs for slider navigation
  const bestsellersRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await productService.getCategories();
      setCategories(res.categories || []);
    } catch {
      // Non-blocking
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await productService.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery.trim() !== '' ? searchQuery.trim() : undefined
      });
      setProducts(res.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers : products.slice(0, 4);

  return (
    <div className="space-y-16 max-w-[1400px] mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 🌿 SECTION 1: HERO SHOWCASE + EXPLORE CATEGORIES SLIDER                   */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Large Sunlit Kitchen Hero Card (Col Span 8) */}
        <div className="lg:col-span-8 relative rounded-[28px] overflow-hidden min-h-[480px] sm:min-h-[540px] flex flex-col justify-between p-6 sm:p-12 shadow-sm border border-stone-200/60 bg-stone-900 group">
          {/* Background Lifestyle Kitchen Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=85&auto=format&fit=crop"
              alt="Eco-Friendly Kitchen"
              fill
              priority
              className="object-cover object-center filter brightness-[0.88] group-hover:scale-105 transition-transform duration-1000"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/30 to-black/30"></div>
          </div>

          {/* Top subtle spacer */}
          <div className="z-10"></div>

          {/* Hero Typography & CTA */}
          <div className="z-10 max-w-xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              Eco-Friendly <br />
              <span className="italic font-normal">Kitchenware</span> for <br />
              a greener home
            </h1>

            <p className="text-xs sm:text-sm text-stone-200/90 max-w-md leading-relaxed">
              Thoughtfully designed non-toxic kitchenware, bamboo tools, and artisan ceramics crafted to nurture both your home and our planet.
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 bg-white text-emerald-950 px-6 py-3 rounded-full font-semibold text-xs tracking-wide hover:bg-stone-100 hover:shadow-lg transition-all active:scale-95"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Stat Badge Glassmorphic Card (Bottom Right) */}
          <div className="z-10 self-end mt-4 sm:mt-0">
            <div className="bg-emerald-950/60 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 text-white flex items-start gap-3 shadow-xl max-w-[200px]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>Natural.</span>
                </div>
                <p className="text-[10px] text-emerald-100/80 font-medium">Sustainable. Eco-conscious.</p>
                <div className="text-3xl font-extrabold font-serif text-white pt-1">96%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Categories 4-Card Slider (Col Span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Explore Collections
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollContainer(exploreRef, 'left')}
                className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollContainer(exploreRef, 'right')}
                className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
                aria-label="Next categories"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal scrollable category tiles */}
          <div
            ref={exploreRef}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 overflow-x-auto pb-1"
          >
            {EXPLORE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-sm border border-stone-200/60 bg-stone-900"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 p-3.5 flex flex-col justify-between text-white z-10">
                  <div />
                  <div className="space-y-2">
                    <p className="text-xs font-serif font-bold whitespace-pre-line leading-tight">
                      {cat.title}
                    </p>
                    <Link
                      href={cat.link}
                      className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/90 backdrop-blur-sm text-stone-900 px-2.5 py-1 rounded-full hover:bg-white transition-colors"
                    >
                      <span>Shop</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🍲 SECTION 2: BESTSELLING PRODUCTS CAROUSEL                                */}
      {/* ========================================================================= */}
      <section id="bestsellers" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Eco Essentials Planet-Friendly
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Bestselling ✧ <span className="italic font-normal">Products</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="text-xs font-bold text-emerald-950 hover:underline flex items-center gap-1 group"
            >
              <span>More products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => scrollContainer(bestsellersRef, 'left')}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors shadow-sm"
                aria-label="Previous bestsellers"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContainer(bestsellersRef, 'right')}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors shadow-sm"
                aria-label="Next bestsellers"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bestselling Horizontal Carousel / Grid */}
        <div
          ref={bestsellersRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-2"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 space-y-3 border border-stone-200">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            displayBestsellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🥘 SECTION 3: SPLIT FEATURE CARDS (BESTSELLERS & NEW ARRIVAL)              */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Feature A: Best Sellers - Rice Cooker Trio */}
        <div className="bg-white rounded-[28px] border border-stone-200/70 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Best <span className="italic font-normal">sellers</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              A polished cooking rice pot rests on a rustic wooden surface, encircled by fresh herbs — a perfect blend of durability and nature for mindful cooking.
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=Appliances"
                className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100">
            <Image
              src="https://images.unsplash.com/photo-1585515320310-259814833e62?w=1000&q=85&auto=format&fit=crop"
              alt="Pastel smart rice cookers"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              unoptimized
            />
          </div>
        </div>

        {/* Feature B: New Arrival - EcoSteam Multi-Cooker */}
        <div className="bg-white rounded-[28px] border border-stone-200/70 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
          <div className="md:col-span-7 relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-stone-100 order-2 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=1000&q=85&auto=format&fit=crop"
              alt="EcoSteam Cooker with vegetables"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              unoptimized
            />
          </div>

          <div className="md:col-span-5 space-y-4 order-1 md:order-2">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              New <span className="italic font-normal">Arrival</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              A EcoSteam showcases a colorful array of fresh, seasonal vegetables — a vibrant celebration of zero-waste, planet-friendly kitchen practices.
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=Appliances"
                className="inline-flex items-center gap-2 bg-emerald-950 text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🖼️ SECTION 4: INSPIRATION GALLERY                                          */}
      {/* ========================================================================= */}
      <section id="gallery" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Thoughtful, Planet-Prioritizing Ideas and Inspiration ✧ <span className="italic font-normal">Gallery</span>
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(galleryRef, 'left')}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors shadow-sm"
              aria-label="Previous gallery images"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(galleryRef, 'right')}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-colors shadow-sm"
              aria-label="Next gallery images"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={galleryRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2"
        >
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-stone-200/60 bg-stone-100 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <span className="text-[11px] font-serif font-semibold text-white leading-tight block drop-shadow">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ⭐ SECTION 5: CUSTOMER REVIEWS & SOCIAL PROOF                             */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-[28px] border border-stone-200/70 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left 4.9 Rating Block (Col Span 4) */}
          <div className="lg:col-span-4 bg-[#f8f6f0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-stone-200/60">
            <div>
              <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                4.9 <span className="text-xl sm:text-2xl text-stone-400 font-sans font-normal">/5</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 my-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              More than <span className="font-bold text-stone-900">25,000 5-Star</span> Reviews for Our Award-Winning ECO-Products across the globe.
            </p>
          </div>

          {/* Right 3/4 Testimonial Cards (Col Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TESTIMONIALS.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="bg-[#fcfbf9] rounded-2xl p-5 flex flex-col justify-between border border-stone-200/60 hover:border-emerald-700/30 transition-all"
              >
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-emerald-800 block">“</span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {item.quote}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200/60 mt-4">
                  <h4 className="text-xs font-bold text-stone-900">{item.author}</h4>
                  <span className="text-[10px] text-stone-500">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛍️ SECTION 6: COMPLETE LIVE PRODUCT CATALOG WITH CATEGORIES FILTER        */}
      {/* ========================================================================= */}
      <section id="shop" className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              All Eco Products & Essentials
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Explore our full catalogue of 100% plastic-free, sustainable kitchenware.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-emerald-950 text-white shadow'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-950 text-white shadow'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 space-y-3 border border-stone-200">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Unable to load products"
              description={error}
              action={
                <Button variant="primary" onClick={fetchProducts}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              }
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="We couldn't find any products matching your search criteria."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filter
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
