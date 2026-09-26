'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { orderService } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { EmptyState } from '@/components/common/EmptyState';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(20),
  address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required').max(10),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleteId, setOrderCompleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '555-0199',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
    },
  });

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Checkout Requires Login"
        description="Please log in to your account before placing an order."
        action={
          <Link href="/login?redirect=/checkout">
            <Button variant="primary">Log In</Button>
          </Link>
        }
      />
    );
  }

  if (orderCompleteId) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6 animate-slide-up">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-600 text-sm">
            Thank you for your purchase. Your order ID is{' '}
            <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
              {orderCompleteId}
            </span>
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <Link href="/orders">
            <Button variant="primary">View My Orders</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Back to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        description="You cannot proceed to checkout with an empty cart."
        action={
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        }
      />
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);
      const res = await orderService.createOrder(data);
      await clearCart();
      showSuccess('Order confirmed! Inventory has been updated.');
      setOrderCompleteId(res.order._id);
    } catch (err: any) {
      showError(err.message || 'Failed to place order. Please check stock availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Shipping & Delivery Details</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please enter the shipping address for your physical parcel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="fullName"
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              required
              {...register('fullName')}
            />
            <Input
              id="email"
              type="email"
              label="Contact Email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              error={errors.phone?.message}
              required
              {...register('phone')}
            />
            <Input
              id="address"
              label="Street Address"
              placeholder="123 Main St, Apt 4B"
              error={errors.address?.message}
              required
              {...register('address')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="city"
              label="City"
              placeholder="New York"
              error={errors.city?.message}
              required
              {...register('city')}
            />
            <Input
              id="state"
              label="State / Province"
              placeholder="NY"
              error={errors.state?.message}
              required
              {...register('state')}
            />
            <Input
              id="postalCode"
              label="Postal Code"
              placeholder="10001"
              error={errors.postalCode?.message}
              required
              {...register('postalCode')}
            />
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          {/* Item Mini-List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="line-clamp-1 font-medium text-slate-700 flex-1 pr-2">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-base">
              <span>Total</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(cart.totalAmount)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full justify-center shadow-lg shadow-slate-900/10"
          >
            <Lock className="w-4 h-4 mr-2" /> Place Order ({formatCurrency(cart.totalAmount)})
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </form>
    </div>
  );
}
