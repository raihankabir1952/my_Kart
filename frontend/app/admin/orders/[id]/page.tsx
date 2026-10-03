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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 sm:text-base">
          <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 sm:p-12">
          <Package className="mx-auto h-12 w-12 text-gray-300 sm:h-14 sm:w-14" />

          <h2 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
            Order not found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            The order you are looking for does not exist.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
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
    <div className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Printable Invoice */}
      <OrderInvoice order={order} />

      {/* Normal Admin Order Details */}
      <div className="print:hidden">
        {/* ================= HEADER ================= */}

        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Order Details
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusConfig.bg} ${statusConfig.text}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-2 break-all font-mono text-xs text-gray-500 sm:text-sm">
                #{order.orderNumber}
              </p>
            </div>

            {/* Print Invoice Button */}
            <button
              onClick={() => window.print()}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"
            >
              <FileText className="h-4 w-4" />
              Print Invoice
            </button>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {/* ================= LEFT CONTENT ================= */}

          <div className="min-w-0 space-y-5 lg:col-span-2 lg:space-y-6">
            {/* ================= CUSTOMER INFORMATION ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <User className="h-5 w-5 text-orange-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900">
                    Customer Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Customer details for this order
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 break-words font-semibold text-gray-900">
                    {order.user?.name || 'N/A'}
                  </p>
                </div>

                {/* Email */}
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <div className="mt-1 flex min-w-0 items-start gap-2 text-gray-700">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <span className="min-w-0 break-all text-sm">
                      {order.user?.email || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="break-all text-sm">
                      {order.shippingPhone ||
                        order.user?.phone ||
                        'N/A'}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="min-w-0 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Shipping Address
                  </p>

                  <div className="mt-1 flex items-start gap-2 text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <span className="break-words text-sm leading-6">
                      {order.shippingAddress || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ORDERED ITEMS ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900">
                    Ordered Items
                  </h2>

                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} product(s) in this order
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 p-3 sm:p-4"
                  >
                    <div className="flex min-w-0 gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20">
                        {item.product?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product.images[0]}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-6 w-6 text-gray-300 sm:h-7 sm:w-7" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                          {item.productName}
                        </h3>

                        <div className="mt-1.5 flex flex-col gap-1 text-xs text-gray-500 sm:mt-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1 sm:text-sm">
                          <span>
                            Price: ৳
                            {Number(
                              item.price,
                            ).toLocaleString()}
                          </span>

                          <span>
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900 sm:text-base">
                          ৳
                          {Number(
                            item.subtotal,
                          ).toLocaleString()}
                        </p>

                        <p className="mt-1 hidden text-xs text-gray-400 sm:block">
                          Subtotal
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= NOTES ================= */}

            {order.notes && (
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900">
                      Customer Notes
                    </h2>

                    <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                      {order.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <div className="min-w-0 space-y-5 lg:space-y-6">
            {/* ================= ORDER INFORMATION ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Order Information
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Order Date */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {orderDate.toLocaleDateString(
                      'en-BD',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    {orderDate.toLocaleTimeString(
                      'en-BD',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Method
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="break-words text-sm font-medium capitalize text-gray-900">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
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

            {/* ================= UPDATE STATUS ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>

                <div className="min-w-0">
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
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value={order.status}>
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </option>

                {nextStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
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
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {updating && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {updating
                  ? 'Updating...'
                  : 'Update Status'}
              </button>

              {!canUpdateStatus && (
                <p className="mt-3 text-xs leading-5 text-gray-500">
                  {order.status === 'delivered'
                    ? 'Delivered orders cannot be changed.'
                    : 'Cancelled orders cannot be changed.'}
                </p>
              )}

              {canUpdateStatus && (
                <p className="mt-3 text-xs leading-5 text-gray-500">
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

            {/* ================= ORDER SUMMARY ================= */}

            <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-lg sm:p-6">
              <h2 className="mb-5 text-lg font-bold">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-gray-300">
                  <span>Subtotal</span>

                  <span className="shrink-0">
                    ৳
                    {Number(
                      order.subtotal,
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-gray-300">
                  <span>Shipping</span>

                  <span className="shrink-0">
                    {Number(
                      order.shippingCost,
                    ) === 0
                      ? 'Free'
                      : `৳${Number(
                          order.shippingCost,
                        ).toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between gap-4 text-lg font-bold">
                    <span>Total</span>

                    <span className="shrink-0">
                      ৳
                      {Number(
                        order.total,
                      ).toLocaleString()}
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