'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types/order';
import OrdersSkeleton from '@/components/skeletons/OrdersSkeleton';

const statusConfig = {
  pending: {
    label: 'Pending',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    dot: 'bg-yellow-400',
    iconBg: 'from-yellow-400 to-orange-400',
    accentBar: 'from-yellow-400 to-orange-400',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    dot: 'bg-green-500',
    iconBg: 'from-green-400 to-emerald-500',
    accentBar: 'from-green-400 to-emerald-500',
    icon: CheckCircle,
  },
  processing: {
    label: 'Processing',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    dot: 'bg-blue-500',
    iconBg: 'from-blue-400 to-indigo-500',
    accentBar: 'from-blue-400 to-indigo-500',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    dot: 'bg-purple-500',
    iconBg: 'from-purple-400 to-pink-500',
    accentBar: 'from-purple-400 to-pink-500',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    dot: 'bg-emerald-500',
    iconBg: 'from-emerald-400 to-teal-500',
    accentBar: 'from-emerald-400 to-teal-500',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    dot: 'bg-red-500',
    iconBg: 'from-red-400 to-rose-500',
    accentBar: 'from-red-400 to-rose-500',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<Order[]>('/orders/me');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <OrdersSkeleton />;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/40">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
              <Receipt className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Track and manage your purchases
              </p>
            </div>
          </div>

          {/* Order count badge */}
          {orders.length > 0 && (
            <div className="hidden rounded-full bg-white px-5 py-2.5 shadow-sm ring-1 ring-gray-200 sm:block">
              <p className="text-sm">
                <span className="text-2xl font-bold text-orange-600">
                  {orders.length}
                </span>{' '}
                <span className="text-gray-600">
                  {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100">
              <ShoppingBag className="h-12 w-12 text-orange-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-2 text-gray-500">
              Start shopping to see your orders here
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const config =
              statusConfig[order.status as OrderStatus] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200/50 hover:ring-orange-200">
                  {/* Colored accent bar (left side) */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${config.accentBar}`}
                  />

                  <div className="flex items-center gap-5 p-6 pl-9">
                    {/* Status icon circle */}
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.iconBg} shadow-md`}
                    >
                      <StatusIcon
                        className="h-7 w-7 text-white"
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Order Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-sm font-bold text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                          />
                          {config.label}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-gray-400" />
                          {order.items?.length || 0}{' '}
                          {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>

                    {/* Total + Arrow */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        ৳{Number(order.total).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 opacity-0 transition group-hover:opacity-100">
                        View details
                        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-orange-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:to-orange-50/40" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}