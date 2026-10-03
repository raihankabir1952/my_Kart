'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Package,
  Search,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';

const statusConfig = {
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: CheckCircle,
  },
  processing: {
    label: 'Processing',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: XCircle,
  },
};

const statusOptions: Array<'all' | OrderStatus> = [
  'all',
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get<Order[]>('/orders');

      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      if (!searchValue) {
        return matchesStatus;
      }

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchValue) ||
        order.user?.name?.toLowerCase().includes(searchValue) ||
        order.user?.email?.toLowerCase().includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === 'pending',
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === 'processing',
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === 'delivered',
  ).length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-medium text-orange-600">
              Store Management
            </p>
          </div>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-bold text-gray-900">
              {filteredOrders.length}
            </span>{' '}
            of{' '}
            <span className="font-bold text-gray-900">{totalOrders}</span>{' '}
            orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Total Orders
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Pending
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <Truck className="h-5 w-5 text-white" />
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Processing
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {processingOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Delivered
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {deliveredOrders}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number, customer name or email..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | OrderStatus)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'all'
                  ? 'All Statuses'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Items
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const config =
                    statusConfig[order.status as OrderStatus] ||
                    statusConfig.pending;

                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-orange-50/30"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="group inline-block"
                        >
                          <p className="font-mono text-sm font-bold text-gray-900 group-hover:text-orange-600">
                            #{order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {order.id.slice(0, 8)}...
                          </p>
                        </Link>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                            <User className="h-4 w-4 text-orange-600" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {order.user?.name || 'N/A'}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span className="max-w-[180px] truncate">
                                {order.user?.email || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(
                                order.createdAt,
                              ).toLocaleDateString('en-BD', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>

                            <p className="text-xs text-gray-500">
                              {new Date(
                                order.createdAt,
                              ).toLocaleTimeString('en-BD', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          <Package className="h-3.5 w-3.5" />
                          {order.items?.length || 0}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ৳{Number(order.total).toLocaleString()}
                        </p>

                        <p
                          className={`mt-1 text-xs font-medium ${
                            order.paymentStatus === 'paid'
                              ? 'text-green-600'
                              : order.paymentStatus === 'failed'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          Payment: {order.paymentStatus}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                          View
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filteredOrders.map((order) => {
              const config =
                statusConfig[order.status as OrderStatus] ||
                statusConfig.pending;

              const StatusIcon = config.icon;

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block p-5 transition hover:bg-orange-50/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold text-gray-900">
                        #{order.orderNumber}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {order.user?.name || 'N/A'}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {order.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 text-xs font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString(
                          'en-BD',
                          {
                            day: '2-digit',
                            month: 'short',
                          },
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Items
                      </p>

                      <p className="mt-1 text-xs font-semibold text-gray-800">
                        {order.items?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                        Total
                      </p>

                      <p className="mt-1 text-xs font-bold text-gray-900">
                        ৳{Number(order.total).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'text-green-600'
                          : order.paymentStatus === 'failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-semibold text-orange-600">
                      View details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
