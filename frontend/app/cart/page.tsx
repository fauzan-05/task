'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, ShieldCheck, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Your Cart is Waiting"
        description="Please sign in to view your eco kitchenware bag and proceed to checkout."
        action={
          <Link href="/login?redirect=/cart">
            <button className="bg-emerald-950 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-emerald-900 transition-colors shadow">
              Log In to View Cart
            </button>
          </Link>
        }
      />
    );
  }

  if (isLoading && !cart) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-8 w-48 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        description="Looks like you haven't added any eco kitchenware essentials to your shopping cart yet."
        action={
          <Link href="/products">
            <button className="bg-emerald-950 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-2 mx-auto shadow">
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Shopping Cart
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your eco kitchenware bag
          </p>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-xs font-semibold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm"
            >
              {/* Product Thumbnail & Title */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Link
                  href={`/products/${item.product._id}`}
                  className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f4f1ea] flex-shrink-0 border border-stone-200/50"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </Link>
                <div className="space-y-1 flex-1">
                  <Link
                    href={`/products/${item.product._id}`}
                    className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-emerald-950 transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[11px] text-stone-500">{item.product.category}</p>
                  <p className="text-xs font-bold text-stone-900">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls and Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition-colors font-bold text-xs"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-stone-900 min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition-colors font-bold text-xs"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-bold font-serif text-stone-900">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Remove item"
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-950 transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-stone-900">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.totalQuantity})</span>
              <span className="font-semibold text-stone-900">
                {formatCurrency(cart.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Eco-Friendly Shipping</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Carbon Offset Fee</span>
              <span className="text-emerald-700 font-bold">$0.00 (Covered by Us)</span>
            </div>
            <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="text-xl font-extrabold font-serif text-stone-900">
                {formatCurrency(cart.totalAmount)}
              </span>
            </div>
          </div>

          <Link href="/checkout" className="block">
            <button className="w-full py-3.5 px-6 rounded-full bg-emerald-950 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 shadow">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Encrypted SSL 256-Bit Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
