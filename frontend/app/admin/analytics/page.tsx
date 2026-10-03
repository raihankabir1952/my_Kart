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

    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;


        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/orders/analytics');
                setAnalytics(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchAnalytics();
        fetchProducts();


    }, [user]);

    if (loading) {
        return (<div className="flex min-h-[60vh] items-center justify-center"> <div className="text-center"> <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /> <p className="mt-4 text-sm text-gray-500">
            Loading analytics... </p> </div> </div>
        );
    }

    if (!analytics) {
        return (<div className="flex min-h-[60vh] items-center justify-center"> <div className="text-center"> <BarChart3 className="mx-auto h-12 w-12 text-gray-400" /> <p className="mt-4 text-gray-500">
            Unable to load analytics data. </p> </div> </div>
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
            value: analytics.statusBreakdown.processing,
        },
        {
            name: 'Shipped',
            value: analytics.statusBreakdown.shipped,
        },
        {
            name: 'Delivered',
            value: analytics.statusBreakdown.delivered,
        },
        {
            name: 'Cancelled',
            value: analytics.statusBreakdown.cancelled,
        },
    ];

    const revenueChartData = analytics.revenueByDate.map((item) => ({
        date: item.date,
        revenue: item.revenue,
    }));

    const topProductsChartData = analytics.topSellingProducts.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
    }));

    const lowStockProducts = products
        .filter((product) => product.stock <= 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

    return (<div className="space-y-8">
        {/* Header */} <div> <div className="flex items-center gap-3"> <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg"> <BarChart3 className="h-6 w-6 text-white" /> </div>


            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Analytics
                </h1>

                <p className="text-sm text-gray-500">
                    Detailed insights into your store performance
                </p>
            </div>
        </div>
        </div>

        {/* Order Status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order Status Distribution
                    </h2>

                    <p className="text-sm text-gray-500">
                        Overview of current order statuses
                    </p>
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Revenue Over Time
                    </h2>

                    <p className="text-sm text-gray-500">
                        Revenue generated from paid orders
                    </p>
                </div>
            </div>

            {revenueChartData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center">
                    <div className="text-center">
                        <TrendingUp className="mx-auto h-10 w-10 text-gray-300" />
                        <p className="mt-3 text-sm text-gray-500">
                            No revenue data available yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueChartData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date" />

                            <YAxis />

                            <Tooltip
                                formatter={(value) => [
                                    `৳${Number(value).toLocaleString()}`,
                                    'Revenue',
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>

        {/* Top Selling Products */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3">
                    <Trophy className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Top Selling Products
                    </h2>

                    <p className="text-sm text-gray-500">
                        Best-performing products based on quantity sold
                    </p>
                </div>
            </div>

            {topProductsChartData.length === 0 ? (
                <div className="flex h-[260px] items-center justify-center">
                    <div className="text-center">
                        <Trophy className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-3 text-sm text-gray-500">
                            No product sales data available yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topProductsChartData}
                            layout="vertical"
                            margin={{
                                left: 20,
                                right: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="name"
                                width={140}
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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Low Stock Products
                    </h2>

                    <p className="text-sm text-gray-500">
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
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />

                        <p className="mt-3 text-sm font-medium text-gray-700">
                            All products are sufficiently stocked.
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            No products currently have 10 or fewer items.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                                <th className="pb-3 text-sm font-semibold text-gray-600">
                                    Product
                                </th>

                                <th className="pb-3 text-sm font-semibold text-gray-600">
                                    Stock
                                </th>

                                <th className="pb-3 text-right text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {lowStockProducts.map((product) => {
                                const isCritical = product.stock <= 5;

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-100 last:border-0"
                                    >
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-gray-100 p-2">
                                                    <Package className="h-4 w-4 text-gray-600" />
                                                </div>

                                                <span className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4">
                                            <span
                                                className={`text-sm font-semibold ${isCritical
                                                        ? 'text-red-600'
                                                        : 'text-orange-600'
                                                    }`}
                                            >
                                                {product.stock} units
                                            </span>
                                        </td>

                                        <td className="py-4 text-right">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isCritical
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                    }`}
                                            >
                                                {isCritical ? 'Critical' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-yellow-50 p-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.pending}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Paid</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.paid}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-50 p-3">
                        <Package className="h-5 w-5 text-purple-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Processing</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.processing}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3">
                        <Truck className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Shipped</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.shipped}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Delivered</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.delivered}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-50 p-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Cancelled</p>
                        <p className="text-xl font-bold text-gray-900">
                            {analytics.statusBreakdown.cancelled}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    );
}
