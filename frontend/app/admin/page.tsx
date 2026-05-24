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
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Package },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
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

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const uniqueCustomers = new Set(orders.map((o) => o.user?.email)).size;
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-medium text-orange-600">Welcome back!</p>
          </div>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your store today
          </p>
        </div>
        {pendingOrders > 0 && (
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:scale-105"
          >
            <Clock className="h-4 w-4" />
            {pendingOrders} Pending {pendingOrders === 1 ? 'Order' : 'Orders'}
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Floating icon */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <p className="mt-4 text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>

              {/* Decorative gradient blob */}
              <div
                className={`pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
              />
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest 5 orders from customers</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const config =
                orderStatusConfig[order.status as OrderStatus] ||
                orderStatusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/30"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                  >
                    <StatusIcon className={`h-5 w-5 ${config.text}`} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-bold text-gray-900">
                      #{order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {order.user?.name} • {order.items?.length || 0} items
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="font-bold text-gray-900">
                      ৳{Number(order.total).toLocaleString()}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}