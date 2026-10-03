'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';
import { Product } from '@/types/product';
import AdminDashboardSkeleton from '@/components/skeletons/AdminDashboardSkeleton';

const orderStatusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: Clock,
  },
  paid: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: CheckCircle,
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: Package,
  },
  shipped: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    icon: Truck,
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    icon: CheckCircle,
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: XCircle,
  },
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        api.get<Order[]>('/orders'),
        api.get<Product[]>('/products'),
      ]);

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminDashboardSkeleton />;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending',
  ).length;

  const uniqueCustomers = new Set(
    orders.map((o) => o.user?.email),
  ).size;

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/30',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      label: 'Total Orders',
      value: orders.length.toString(),
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/30',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      label: 'Products',
      value: products.length.toString(),
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30',
      bgGradient: 'from-blue-50 to-indigo-50',
    },
    {
      label: 'Customers',
      value: uniqueCustomers.toString(),
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/30',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="min-h-full min-w-0 overflow-x-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 sm:h-8 sm:w-8">
                <Sparkles className="h-4 w-4 text-orange-500 sm:h-4 sm:w-4" />
              </div>

              <p className="text-xs font-semibold text-orange-600 sm:text-sm">
                Welcome back!
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Dashboard
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
              Here&apos;s what&apos;s happening with your store today
            </p>
          </div>

          {pendingOrders > 0 && (
            <Link
              href="/admin/orders"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02] hover:shadow-xl sm:w-auto"
            >
              <Clock className="h-4 w-4 shrink-0" />

              <span>
                {pendingOrders} Pending{' '}
                {pendingOrders === 1 ? 'Order' : 'Orders'}
              </span>
            </Link>
          )}
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`group relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-4 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5 lg:p-6`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow} sm:h-12 sm:w-12`}
                  >
                    <Icon
                      className="h-5 w-5 text-white sm:h-6 sm:w-6"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                <p className="mt-3 text-[11px] font-semibold leading-4 text-gray-600 sm:mt-4 sm:text-sm">
                  {stat.label}
                </p>

                <p className="mt-1 break-all text-xl font-bold leading-tight text-gray-900 sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>

                <div
                  className={`pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
                />
              </div>
            );
          })}
        </div>

        {/* ================= RECENT ORDERS ================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-6">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Recent Orders
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Latest 5 orders from customers
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 hover:text-orange-700 sm:text-sm"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* Empty State */}
          {recentOrders.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6 sm:py-14">
              <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />

              <p className="mt-3 text-sm text-gray-500">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-3 sm:p-4">
              {recentOrders.map((order) => {
                const config =
                  orderStatusConfig[
                    order.status as OrderStatus
                  ] || orderStatusConfig.pending;

                const StatusIcon = config.icon;

                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="group block min-w-0 rounded-xl border border-gray-100 p-3 transition hover:border-orange-200 hover:bg-orange-50/30 sm:p-4"
                  >
                    {/* Main Order Row */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      {/* Status Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} sm:h-11 sm:w-11`}
                      >
                        <StatusIcon
                          className={`h-5 w-5 ${config.text}`}
                          strokeWidth={2.5}
                        />
                      </div>

                      {/* Order Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-bold text-gray-900 sm:text-sm">
                          #{order.orderNumber}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                          {order.user?.name || 'Customer'} •{' '}
                          {order.items?.length || 0}{' '}
                          {(order.items?.length || 0) === 1
                            ? 'item'
                            : 'items'}
                        </p>
                      </div>

                      {/* Desktop Amount + Status */}
                      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                        <p className="text-sm font-bold text-gray-900 lg:text-base">
                          ৳{Number(order.total).toLocaleString()}
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Mobile Arrow */}
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500 sm:hidden" />
                    </div>

                    {/* Mobile Amount + Status */}
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 sm:hidden">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
                      >
                        {order.status}
                      </span>

                      <p className="text-sm font-bold text-gray-900">
                        ৳{Number(order.total).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}