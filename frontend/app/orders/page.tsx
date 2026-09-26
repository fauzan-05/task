'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order } from '@/types';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await orderService.getUserOrders();
        setOrders(res.orders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign In to View Orders"
        description="Please log in to your account to review your purchase history and tracking details."
        action={
          <Link href="/login?redirect=/orders">
            <Button variant="primary">Log In</Button>
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Orders"
        description={error}
        action={
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Found"
        description="You haven't placed any orders yet. Discover our premium catalog and make your first order today!"
        action={
          <Link href="/products">
            <Button variant="primary">
              <ShoppingBag className="w-4 h-4 mr-2" /> Explore Products
            </Button>
          </Link>
        }
      />
    );
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Delivered':
        return 'info';
      case 'Cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Order History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your recent purchases, order receipts, and shipping statuses.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header: Order ID, Date, Status Badge, Total */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="font-mono text-xs font-bold text-slate-700">
                    #{order._id}
                  </span>
                  <Badge variant={getStatusVariant(order.status)} size="sm">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items ({order.items.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    {item.image && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-xs text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 gap-2">
              <div>
                <span className="font-semibold text-slate-700">Ship to: </span>
                {order.shippingAddress.fullName}, {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </div>
              <Link href="/products" className="font-semibold text-slate-900 hover:underline flex items-center gap-1">
                Shop More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
