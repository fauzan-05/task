'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { RefreshCw } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

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

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto py-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            All Eco Kitchenware & Essentials
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse our complete collection of planet-prioritizing kitchenware.
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
    </div>
  );
}
