'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import AdminDashboardSkeleton from '@/components/skeletons/AdminDashboardSkeleton';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Order[]>('/orders'),
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;

      const totalRevenue = orders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + Number(o.total), 0);

      const pendingOrders = orders.filter(
        (o) => o.status === 'pending',
      ).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      label: 'Revenue',
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
  ];

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-600">Welcome back, admin!</p>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <span className={`rounded-md p-2 ${card.bg} ${card.text}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="mt-8 rounded-lg bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-6 text-gray-500">No orders yet</p>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ৳{Number(order.total).toLocaleString()}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : order.status === 'delivered'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}