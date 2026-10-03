'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import OrderInvoice from '@/components/admin/OrderInvoice';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  Truck,
  FileText,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';

const orderStatusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
  paid: {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  shipped: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
  },
};

// Strict order workflow
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus | ''>('');

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await api.get<Order>(`/orders/${id}`);

      setOrder(res.data);
      setSelectedStatus(res.data.status);
    } catch (error: any) {
      console.error('Failed to fetch order:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load order details',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    if (selectedStatus === order.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdating(true);

      const res = await api.patch<Order>(
        `/orders/${order.id}/status`,
        {
          status: selectedStatus,
        },
      );

      setOrder(res.data);
      setSelectedStatus(res.data.status);

      toast.success('Order status updated successfully');
    } catch (error: any) {
      console.error('Failed to update status:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to update order status',
      );

      setSelectedStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <Package className="mx-auto h-14 w-14 text-gray-300" />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The order you are looking for does not exist.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig =
    orderStatusConfig[order.status as OrderStatus] ||
    orderStatusConfig.pending;

  const orderDate = new Date(order.createdAt);

  const nextStatuses = allowedTransitions[order.status];

  const canUpdateStatus = nextStatuses.length > 0;

  return (
    <div className="p-8">
      {/* Printable Invoice */}
      <OrderInvoice order={order} />

      {/* Normal Admin Order Details */}
      <div className="print:hidden">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Details
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusConfig.bg} ${statusConfig.text}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-2 font-mono text-sm text-gray-500">
                #{order.orderNumber}
              </p>
            </div>

            {/* Print Invoice Button */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              <FileText className="h-4 w-4" />
              Print Invoice
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <User className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Customer Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Customer details for this order
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {order.user?.name || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{order.user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />

                    <span>
                      {order.shippingPhone ||
                        order.user?.phone ||
                        'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Shipping Address
                  </p>

                  <div className="mt-1 flex items-start gap-2 text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                    <span>
                      {order.shippingAddress || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Ordered Items
                  </h2>

                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} product(s) in this
                    order
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-7 w-7 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>
                          Price: ৳
                          {Number(item.price).toLocaleString()}
                        </span>

                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ৳{Number(item.subtotal).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Subtotal
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Customer Notes
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {order.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Order Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Order Information
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {orderDate.toLocaleDateString('en-BD', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  <p className="text-xs text-gray-500">
                    {orderDate.toLocaleTimeString('en-BD', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Method
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />

                    <span className="text-sm font-medium capitalize text-gray-900">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Order Status
                  </h2>

                  <p className="text-xs text-gray-500">
                    Update order progress
                  </p>
                </div>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as OrderStatus,
                  )
                }
                disabled={
                  updating || !canUpdateStatus
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value={order.status}>
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </option>

                {nextStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleStatusUpdate}
                disabled={
                  updating ||
                  selectedStatus === order.status ||
                  !canUpdateStatus
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updating && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {updating
                  ? 'Updating...'
                  : 'Update Status'}
              </button>

              {!canUpdateStatus && (
                <p className="mt-3 text-xs text-gray-500">
                  {order.status === 'delivered'
                    ? 'Delivered orders cannot be changed.'
                    : 'Cancelled orders cannot be changed.'}
                </p>
              )}

              {canUpdateStatus && (
                <p className="mt-3 text-xs text-gray-500">
                  Next available:{' '}
                  {nextStatuses
                    .map(
                      (status) =>
                        status.charAt(0).toUpperCase() +
                        status.slice(1),
                    )
                    .join(' or ')}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-lg">
              <h2 className="mb-5 text-lg font-bold">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>

                  <span>
                    ৳{Number(order.subtotal).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>

                  <span>
                    {Number(order.shippingCost) === 0
                      ? 'Free'
                      : `৳${Number(
                          order.shippingCost,
                        ).toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>

                    <span>
                      ৳{Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
