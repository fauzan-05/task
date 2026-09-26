'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Order, OrderStats } from '@/types';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'] as const;

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'admin@gmail.com';

  const loadData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        orderService.getAllOrdersAdmin({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: search.trim() || undefined,
        }),
        orderService.getOrderStatsAdmin(),
      ]);
      setOrders(ordersRes.orders || []);
      setStats(statsRes.stats || null);
    } catch (err: any) {
      showError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin, statusFilter, search, showError]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const timer = setTimeout(loadData, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAdmin, loadData]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setBusyId(orderId);
      const res = await orderService.updateOrderStatusAdmin(orderId, status);
      showSuccess(`Order updated to ${status}`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: res.order.status } : o)));
      if (activeOrder?._id === orderId) {
        setActiveOrder({ ...activeOrder, status: res.order.status });
      }
      orderService.getOrderStatsAdmin().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      showError(err.message || 'Status update failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      setBusyId(orderId);
      await orderService.deleteOrderAdmin(orderId);
      showSuccess('Order deleted');
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (activeOrder?._id === orderId) setActiveOrder(null);
      orderService.getOrderStatsAdmin().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      showError(err.message || 'Delete failed');
    } finally {
      setBusyId(null);
    }
  };

  const statusBadge = (status: Order['status']) => {
    const styles: Record<string, string> = {
      Confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
      Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      Pending: 'bg-amber-50 text-amber-800 border-amber-200',
      Cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[status] || ''}`}>
        {status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : status === 'Cancelled' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Admin Portal Access</h1>
            <p className="text-xs text-stone-500 mt-1">Please sign in with administrator credentials.</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl text-left text-xs space-y-1 font-mono text-stone-600 border border-stone-200">
            <div className="font-sans font-bold text-stone-900 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-800" /> Super Admin Credentials</div>
            <div>Email: <b>admin@gmail.com</b></div>
            <div>Password: <b>admin123</b></div>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-emerald-950 hover:bg-emerald-900"
            onClick={async () => {
              const ok = await login({ email: 'admin@gmail.com', password: 'admin123' });
              if (ok) window.location.reload();
            }}
          >
            Sign In as Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 animate-fade-in">
      {/* Admin Header */}
      <header className="bg-emerald-950 text-white rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Orders
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 mt-0.5">Real-time orders management & fulfillment</p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-900/60 border border-emerald-800 px-3 py-1.5 rounded-full text-xs text-emerald-100">
            <User className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-bold">{user?.name || 'Super Admin'}</span>
          </div>

          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="text-xs rounded-full border-emerald-800 bg-emerald-900/50 text-white hover:bg-emerald-800">
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>

          <Link href="/products" className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-900/60 border border-emerald-700 text-emerald-100 hover:bg-emerald-800">
            <span>View Store</span> <ExternalLink className="w-3 h-3 text-emerald-300" />
          </Link>

          <button onClick={async () => { await logout(); window.location.href = '/login'; }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          { label: 'Total Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '—', icon: TrendingUp, color: 'text-emerald-800 bg-emerald-50' },
          { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-stone-800 bg-stone-100' },
          { label: 'Confirmed', value: stats?.confirmedOrders ?? '—', icon: Clock, color: 'text-blue-800 bg-blue-50' },
          { label: 'Delivered', value: stats?.deliveredOrders ?? '—', icon: CheckCircle2, color: 'text-emerald-800 bg-emerald-50' },
          { label: 'Items Sold', value: stats?.totalItemsSold ?? '—', icon: Package, color: 'text-amber-800 bg-amber-50' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-semibold">{m.label}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${m.color}`}>
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold font-serif text-stone-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'Confirmed', 'Delivered', 'Pending', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === st ? 'bg-emerald-950 text-white shadow-sm' : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, city, email, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-900/30"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10">
            <EmptyState title="No orders found" description="Orders placed from cart will automatically appear here." />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f7f5f0] text-stone-700 border-b border-stone-200 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {orders.map((o) => {
                  const first = o.items[0];
                  const totalQty = o.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr key={o._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-stone-900 block">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(o.createdAt)}</span>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <p className="font-bold text-stone-900">{o.shippingAddress.fullName}</p>
                        <p className="text-[11px] text-stone-500">{o.shippingAddress.email}</p>
                        <p className="text-[11px] text-stone-400">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          {first?.image ? (
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-stone-100 border flex-shrink-0">
                              <Image src={first.image} alt={first.productName} fill className="object-cover" unoptimized />
                            </div>
                          ) : <Package className="w-8 h-8 text-stone-400" />}
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-800 truncate">{first?.productName}</p>
                            <span className="text-[10px] text-emerald-900 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              {totalQty} {totalQty === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top font-serif font-bold text-stone-900 text-sm">
                        {formatCurrency(o.totalAmount)}
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1.5">
                          <div>{statusBadge(o.status)}</div>
                          <select
                            value={o.status}
                            disabled={busyId === o._id}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-800 rounded-lg px-2 py-1 cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((st) => <option key={st} value={st}>{st}</option>)}
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setActiveOrder(o)} className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(o._id)} disabled={busyId === o._id} className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-serif font-bold text-stone-900">Order #{activeOrder._id.slice(-6).toUpperCase()}</h2>
                  {statusBadge(activeOrder.status)}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{formatDate(activeOrder.createdAt)}</p>
              </div>
              <button onClick={() => setActiveOrder(null)} className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 flex items-center justify-center">✕</button>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div>
                <div className="font-bold text-stone-900 flex items-center gap-1"><User className="w-3.5 h-3.5 text-emerald-800" /> Customer</div>
                <p className="font-semibold text-stone-800 mt-1">{activeOrder.shippingAddress.fullName}</p>
                <p className="text-stone-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {activeOrder.shippingAddress.email}</p>
                <p className="text-stone-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {activeOrder.shippingAddress.phone}</p>
              </div>
              <div>
                <div className="font-bold text-stone-900 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-800" /> Shipping Address</div>
                <p className="text-stone-700 mt-1">{activeOrder.shippingAddress.address}</p>
                <p className="text-stone-500">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Cart Items</h3>
              <div className="divide-y border rounded-2xl overflow-hidden">
                {activeOrder.items.map((it, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-2.5">
                      {it.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border flex-shrink-0">
                          <Image src={it.image} alt={it.productName} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-stone-900">{it.productName}</p>
                        <p className="text-stone-500">{formatCurrency(it.price)} × {it.quantity} qty</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatCurrency(it.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t flex items-center justify-between">
              <span className="font-serif font-bold text-stone-700">Total:</span>
              <span className="text-lg font-serif font-extrabold text-stone-900">{formatCurrency(activeOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
