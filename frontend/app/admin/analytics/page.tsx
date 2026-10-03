'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  TrendingUp,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Analytics {
  totalOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  totalRevenue: number;

  statusBreakdown: {
    pending: number;
    paid: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  revenueByDate: {
    date: string;
    revenue: number;
  }[];

  topSellingProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        const response = await api.get(
          '/orders/analytics',
        );

        setAnalytics(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch analytics:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');

        setProducts(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch products:',
          error,
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchAnalytics();
    fetchProducts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />

          <p className="mt-4 text-sm text-gray-500">
            Unable to load analytics data.
          </p>
        </div>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Pending',
      value: analytics.statusBreakdown.pending,
    },
    {
      name: 'Paid',
      value: analytics.statusBreakdown.paid,
    },
    {
      name: 'Processing',
      value:
        analytics.statusBreakdown.processing,
    },
    {
      name: 'Shipped',
      value: analytics.statusBreakdown.shipped,
    },
    {
      name: 'Delivered',
      value:
        analytics.statusBreakdown.delivered,
    },
    {
      name: 'Cancelled',
      value:
        analytics.statusBreakdown.cancelled,
    },
  ];

  const revenueChartData =
    analytics.revenueByDate.map((item) => ({
      date: item.date,
      revenue: item.revenue,
    }));

  const topProductsChartData =
    analytics.topSellingProducts.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
    }));

  const lowStockProducts = products
    .filter((product) => product.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="w-full space-y-5 overflow-x-hidden p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg sm:p-3">
            <BarChart3 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Analytics
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Detailed insights into your store
              performance
            </p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 sm:p-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Order Status Distribution
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Overview of current order statuses
            </p>
          </div>
        </div>

        <div className="h-[280px] w-full sm:h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={55}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                name="Orders"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Over Time */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <div className="shrink-0 rounded-xl bg-emerald-50 p-2.5 sm:p-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Revenue Over Time
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Revenue generated from paid orders
            </p>
          </div>
        </div>

        {revenueChartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center sm:h-[300px]">
            <div className="px-4 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-gray-300" />

              <p className="mt-3 text-sm text-gray-500">
                No revenue data available yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={revenueChartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                />

                <YAxis
                  tick={{ fontSize: 10 }}
                  width={45}
                />

                <Tooltip
                  formatter={(value) => [
                    `৳${Number(
                      value,
                    ).toLocaleString()}`,
                    'Revenue',
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Selling Products */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <div className="shrink-0 rounded-xl bg-amber-50 p-2.5 sm:p-3">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Top Selling Products
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Best-performing products based on
              quantity sold
            </p>
          </div>
        </div>

        {topProductsChartData.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center sm:h-[260px]">
            <div className="px-4 text-center">
              <Trophy className="mx-auto h-10 w-10 text-gray-300" />

              <p className="mt-3 text-sm text-gray-500">
                No product sales data available
                yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[340px] w-full sm:h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={topProductsChartData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={95}
                  tick={{
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    value.length > 15
                      ? `${value.slice(
                          0,
                          15,
                        )}...`
                      : value
                  }
                />

                <Tooltip />

                <Bar
                  dataKey="quantity"
                  name="Units Sold"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Low Stock Products */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start gap-3 sm:mb-6">
          <div className="shrink-0 rounded-xl bg-red-50 p-2.5 sm:p-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Low Stock Products
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Products that need inventory attention
            </p>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex h-[180px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

              <p className="mt-3 text-sm text-gray-500">
                Checking inventory...
              </p>
            </div>
          </div>
        ) : lowStockProducts.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center">
            <div className="px-4 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />

              <p className="mt-3 text-sm font-medium text-gray-700">
                All products are sufficiently
                stocked.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                No products currently have 10 or
                fewer items.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 pr-4 text-xs font-semibold text-gray-600 sm:text-sm">
                    Product
                  </th>

                  <th className="pb-3 text-xs font-semibold text-gray-600 sm:text-sm">
                    Stock
                  </th>

                  <th className="pb-3 text-right text-xs font-semibold text-gray-600 sm:text-sm">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map(
                  (product) => {
                    const isCritical =
                      product.stock <= 5;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3 pr-4 sm:py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="shrink-0 rounded-lg bg-gray-100 p-2">
                              <Package className="h-4 w-4 text-gray-600" />
                            </div>

                            <span className="max-w-[220px] truncate text-xs font-medium text-gray-900 sm:max-w-none sm:text-sm">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 sm:py-4">
                          <span
                            className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${
                              isCritical
                                ? 'text-red-600'
                                : 'text-orange-600'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>

                        <td className="py-3 text-right sm:py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${
                              isCritical
                                ? 'bg-red-100 text-red-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {isCritical
                              ? 'Critical'
                              : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {/* Pending */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-yellow-50 p-2.5 sm:p-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Pending
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {analytics.statusBreakdown.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 sm:p-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Paid
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {analytics.statusBreakdown.paid}
              </p>
            </div>
          </div>
        </div>

        {/* Processing */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-purple-50 p-2.5 sm:p-3">
              <Package className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Processing
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {
                  analytics.statusBreakdown
                    .processing
                }
              </p>
            </div>
          </div>
        </div>

        {/* Shipped */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-2.5 sm:p-3">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Shipped
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {
                  analytics.statusBreakdown
                    .shipped
                }
              </p>
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-emerald-50 p-2.5 sm:p-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Delivered
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {
                  analytics.statusBreakdown
                    .delivered
                }
              </p>
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-red-50 p-2.5 sm:p-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 sm:text-sm">
                Cancelled
              </p>

              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {
                  analytics.statusBreakdown
                    .cancelled
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}