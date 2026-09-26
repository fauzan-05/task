'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Leaf,
  Star,
  Sparkles,
  Package,
  Heart,
  Share2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'sustainability' | 'reviews'>('details');

  const { addToCart, cart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProductAndRelated = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await productService.getProductById(id);
        setProduct(res.product);

        // Fetch related products in the same category or bestsellers
        const relatedRes = await productService.getProducts({
          category: res.product.category
        });
        const others = (relatedRes.products || []).filter((p) => p._id !== id).slice(0, 4);
        setRelatedProducts(others);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto py-8">
        <Skeleton className="h-6 w-40 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border border-stone-200">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <EmptyState
        title="Product Not Found"
        description={error || 'The requested product does not exist or has been removed.'}
        action={
          <button
            onClick={() => router.push('/products')}
            className="bg-emerald-950 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-emerald-900 transition-colors"
          >
            Back to Products
          </button>
        }
      />
    );
  }

  const cartItem = cart?.items.find((i) => i.product._id === product._id);
  const quantityInCart = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;
  const maxAvailableToAdd = Math.max(0, product.stock - quantityInCart);

  const handleAddToCart = async () => {
    if (isOutOfStock || quantity > maxAvailableToAdd) return;

    setIsAdding(true);
    const success = await addToCart(product._id, quantity);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    }
  };

  const colors = product.colors && product.colors.length > 0
    ? product.colors
    : ['#8ecae6', '#a7c957', '#2a9d8f'];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 font-semibold hover:text-emerald-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>
        <span className="hidden sm:inline-block">
          Home / {product.category} / <span className="text-stone-900 font-medium">{product.name}</span>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 MAIN PRODUCT SHOWCASE CARD                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Image & Gallery Display (Col Span 6) */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f1ea] border border-stone-200/60 shadow-inner group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-stone-800 shadow-sm border border-stone-100">
                  {product.badge}
                </span>
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Value Micro-Pills */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-stone-200/60 flex items-center gap-2 text-stone-800">
              <Leaf className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span className="text-[11px] font-semibold leading-tight">100% Non-Toxic</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-stone-200/60 flex items-center gap-2 text-stone-800">
              <Package className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span className="text-[11px] font-semibold leading-tight">Zero Plastic</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-stone-200/60 flex items-center gap-2 text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span className="text-[11px] font-semibold leading-tight">FSC Certified</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form (Col Span 6) */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.9}</span>
                <span className="text-stone-400">({product.reviewsCount || 120} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-stone-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Free Carbon-Neutral Shipping
              </span>
            </div>
          </div>

          {/* Color/Finish Selection */}
          {colors.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Choose Organic Finish:</span>
                <span className="text-stone-500 font-medium">Option {selectedColor + 1} of {colors.length}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {colors.map((hex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(idx)}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer relative ${
                      selectedColor === idx
                        ? 'scale-110 ring-2 ring-emerald-950 ring-offset-2'
                        : 'opacity-85 hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Color option ${idx + 1}`}
                  >
                    {selectedColor === idx && (
                      <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white shadow-sm"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Overview */}
          <div className="text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-4 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector & Add to Cart Section */}
          <div className="border-t border-stone-100 pt-6 space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-800">Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3.5 py-1.5 text-stone-700 hover:bg-stone-200 disabled:opacity-30 transition-colors font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-stone-900 min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxAvailableToAdd, q + 1))}
                      disabled={quantity >= maxAvailableToAdd}
                      className="px-3.5 py-1.5 text-stone-700 hover:bg-stone-200 disabled:opacity-30 transition-colors font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-500">
                  {product.stock > 0 ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Sold Out</span>
                  )}
                </div>
              </div>
            )}

            {/* Main Add to Cart Button */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || maxAvailableToAdd <= 0 || isAdding}
                className={`w-full py-4 px-8 rounded-full font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md ${
                  justAdded
                    ? 'bg-emerald-700 text-white scale-[0.99]'
                    : isOutOfStock
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    : 'bg-emerald-950 text-white hover:bg-emerald-900 active:scale-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added {quantity} to Cart Successfully!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock
                      ? 'Sold Out'
                      : maxAvailableToAdd <= 0
                      ? 'Maximum In Cart'
                      : `Add to Cart — ${formatCurrency(product.price * quantity)}`}
                  </>
                )}
              </button>

              {/* View Cart Quick Link */}
              {justAdded && (
                <div className="text-center pt-1 animate-fade-in">
                  <Link
                    href="/cart"
                    className="text-xs font-bold text-emerald-950 hover:underline"
                  >
                    View Shopping Cart & Checkout →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Guarantees & Trust Badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-stone-100 pt-6 text-center">
            <div className="p-3 bg-[#fbf9f5] rounded-2xl space-y-1 border border-stone-200/50">
              <Truck className="w-4 h-4 mx-auto text-emerald-800" />
              <p className="text-[11px] font-semibold text-stone-800">Carbon Neutral</p>
            </div>
            <div className="p-3 bg-[#fbf9f5] rounded-2xl space-y-1 border border-stone-200/50">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-800" />
              <p className="text-[11px] font-semibold text-stone-800">2-Year Warranty</p>
            </div>
            <div className="p-3 bg-[#fbf9f5] rounded-2xl space-y-1 border border-stone-200/50">
              <RefreshCw className="w-4 h-4 mx-auto text-emerald-800" />
              <p className="text-[11px] font-semibold text-stone-800">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📋 COMPREHENSIVE PRODUCT INFORMATION TABS                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Tab Headers */}
        <div className="flex items-center gap-3 border-b border-stone-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
              activeTab === 'details'
                ? 'border-emerald-950 text-emerald-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Product Overview & Story
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
              activeTab === 'specs'
                ? 'border-emerald-950 text-emerald-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Materials & Specifications
          </button>
          <button
            onClick={() => setActiveTab('sustainability')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
              activeTab === 'sustainability'
                ? 'border-emerald-950 text-emerald-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sustainability & Planet Impact
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-serif font-bold transition-colors whitespace-nowrap border-b-2 -mb-px ${
              activeTab === 'reviews'
                ? 'border-emerald-950 text-emerald-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Verified Customer Reviews ({product.reviewsCount || 120})
          </button>
        </div>

        {/* Tab 1: Product Overview */}
        {activeTab === 'details' && (
          <div className="space-y-6 text-stone-700 leading-relaxed text-xs sm:text-sm animate-fade-in">
            <div className="max-w-3xl space-y-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Crafted for Mindful, Greener Culinary Experiences
              </h3>
              <p>
                Every element of the <span className="font-semibold text-stone-900">{product.name}</span> has been engineered to unite enduring functional kitchen performance with zero-waste, planet-prioritizing values. Hand-inspected to ensure clean lines, durability, and healthy toxin-free daily use.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200/60 space-y-1">
                  <h4 className="font-bold text-stone-900">🍃 100% Non-Toxic & Food Safe</h4>
                  <p className="text-xs text-stone-500">Free of PTFE, PFOA, lead, cadmium, phthalates, and harmful heavy metal glazes.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-stone-200/60 space-y-1">
                  <h4 className="font-bold text-stone-900">🪵 Organic Sustainable Materials</h4>
                  <p className="text-xs text-stone-500">Constructed from responsibly harvested FSC bamboo, stoneware clay, and recyclable metals.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Materials & Specs */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm animate-fade-in">
            <div className="space-y-3">
              <h3 className="text-base font-serif font-bold text-stone-900">Technical Specifications</h3>
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500 w-1/3">Category</td>
                    <td className="py-2.5 font-bold text-stone-900">{product.category}</td>
                  </tr>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500">Primary Material</td>
                    <td className="py-2.5 font-bold text-stone-900">Organic Bamboo / Mineral Glazed Ceramic</td>
                  </tr>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500">Care Instructions</td>
                    <td className="py-2.5 font-bold text-stone-900">Hand wash with mild eco detergent or top-rack dishwasher safe</td>
                  </tr>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500">Heat Tolerance</td>
                    <td className="py-2.5 font-bold text-stone-900">Oven-safe up to 260°C / 500°F</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-serif font-bold text-stone-900">Packaging & Weight</h3>
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500 w-1/3">Package Material</td>
                    <td className="py-2.5 font-bold text-stone-900">100% Recycled Kraft Paper & Soy Inks</td>
                  </tr>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500">Origin</td>
                    <td className="py-2.5 font-bold text-stone-900">Ethically handcrafted partner artisanal workshops</td>
                  </tr>
                  <tr className="border-b border-stone-100 py-2">
                    <td className="py-2.5 font-semibold text-stone-500">Certifications</td>
                    <td className="py-2.5 font-bold text-stone-900">FSC Certified, FDA Approved, Plastic Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Sustainability */}
        {activeTab === 'sustainability' && (
          <div className="space-y-6 text-xs sm:text-sm animate-fade-in">
            <div className="max-w-3xl space-y-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Our Planet-First Promise for Every Purchase
              </h3>
              <p className="text-stone-600 leading-relaxed">
                By choosing Homedine, you keep single-use plastics out of landfills and support regenerative agricultural supply chains. We calculate the carbon footprint of every product shipped and offset 100% of emissions through verified forest conservation projects.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 space-y-1">
                  <div className="text-2xl font-serif font-bold">0%</div>
                  <div className="text-xs font-bold">Plastic Waste</div>
                  <p className="text-[11px] text-emerald-800">100% compostable shipping materials.</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 space-y-1">
                  <div className="text-2xl font-serif font-bold">100%</div>
                  <div className="text-xs font-bold">Carbon Offset</div>
                  <p className="text-[11px] text-emerald-800">Neutral shipping on every domestic order.</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 space-y-1">
                  <div className="text-2xl font-serif font-bold">FSC</div>
                  <div className="text-xs font-bold">Ethical Wood</div>
                  <p className="text-[11px] text-emerald-800">Preserving old-growth forests worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between bg-[#fbf9f5] p-6 rounded-2xl border border-stone-200/60">
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                  {product.rating || 4.9} <span className="text-stone-400 text-lg font-sans">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-500">Based on {product.reviewsCount || 120} verified customer reviews</p>
              </div>
              <div className="text-xs text-emerald-900 font-semibold bg-white px-4 py-2 rounded-full border border-stone-200">
                ⭐ 98% of buyers recommend this product
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl border border-stone-200/60 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">Jane C.</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Verified Buyer</span>
                  </div>
                  <span className="text-[11px] text-stone-400">2 days ago</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  "Exceeded all my expectations! The craftsmanship is incredible, it feels substantial and looks gorgeous on my open shelves."
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200/60 space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">Marcus L.</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Verified Buyer</span>
                  </div>
                  <span className="text-[11px] text-stone-400">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  "Zero plastic packaging when it arrived in the mail. Beautiful quality and so easy to clean."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🌿 RELATED / RECOMMENDED ECO KITCHENWARE                                   */}
      {/* ========================================================================= */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">Complete the Look</span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                You May Also <span className="italic font-normal">Love</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-emerald-950 hover:underline"
            >
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
