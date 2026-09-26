'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, User as UserIcon, Search, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Do not render public consumer navbar on Admin Portal pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    router.push('/login');
  };

  return (
    <header className="w-full pt-3 pb-3 px-3 sm:px-6 sticky top-0 z-50 bg-[#f7f5f0]/80 backdrop-blur-md transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-700 tracking-wide">
          <Link href="/products" className="hover:text-emerald-900 transition-colors">
            Shop
          </Link>
          <Link href="/#bestsellers" className="hover:text-emerald-900 transition-colors">
            Bestsellers
          </Link>
          <Link href="/#gallery" className="hover:text-emerald-900 transition-colors">
            Gallery
          </Link>
          <Link href="/#about" className="hover:text-emerald-900 transition-colors">
            About
          </Link>
        </nav>

        {/* Center Logo - Homedine */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-950 italic group-hover:opacity-90 transition-opacity">
            Homedine
          </span>
        </Link>

        {/* Right Search & Profile Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Pill Search Input */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/90 border border-stone-200/80 rounded-full pl-3 pr-1 py-1 shadow-sm hover:border-emerald-700/40 transition-all w-40 sm:w-56"
          >
            <input
              type="text"
              placeholder="Search Product..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none px-1"
            />
            <button
              type="submit"
              aria-label="Search"
              className="w-7 h-7 rounded-full bg-emerald-950 text-white flex items-center justify-center hover:bg-emerald-900 transition-colors flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Cart Icon Button */}
          <Link href="/cart" aria-label="Shopping Cart">
            <button
              className="relative w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-emerald-950 hover:bg-stone-50 transition-all shadow-sm group"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-950 group-hover:scale-105 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-950 text-white text-[9px] font-bold flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          {/* User Account Button */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-emerald-950 hover:bg-stone-50 transition-all shadow-sm"
              title="Account"
              aria-label="User Account"
            >
              <UserIcon className="w-4 h-4 text-emerald-950" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-slide-up">
                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      View Cart ({itemCount})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 p-1">
                    <Link
                      href="/login"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-3 py-2 text-xs font-bold text-stone-900 hover:bg-stone-50 rounded-xl transition-colors text-center"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-3 py-2 text-xs font-bold text-white bg-emerald-950 hover:bg-emerald-900 rounded-xl transition-colors text-center shadow-sm"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

