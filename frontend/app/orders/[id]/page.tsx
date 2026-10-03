'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';
import OrderInvoice from '@/components/admin/OrderInvoice';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-700 bg-yellow-100',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    color: 'text-blue-700 bg-blue-100',
    icon: CheckCircle,
  },
  processing: {
    label: 'Processing',
    color: 'text-indigo-700 bg-indigo-100',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-purple-700 bg-purple-100',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700 bg-green-100',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700 bg-red-100',
    icon: XCircle,
  },
};

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] =
    useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!id) return;

    fetchOrder();
  }, [id, user, authLoading]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await api.get<Order>(`/orders/${id}`);

      setOrder(res.data);
    } catch (error) {
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    setCancelling(true);

    try {
      const res = await api.patch<Order>(
        `/orders/${id}/cancel`,
      );

      setOrder(res.data);

      toast.success('Order cancelled successfully');

      setShowCancelConfirm(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Cancel failed',
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading || authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <p className="mt-3 text-sm text-gray-600">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <Package className="mx-auto h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Order not found
          </h2>

          <Link
            href="/orders"
            className="mt-6 inline-flex min-h-10 items-center text-sm font-medium text-orange-600 hover:underline"
          >
            ← Back to my orders
          </Link>
        </div>
      </main>
    );
  }

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;

  // Cancel allowed only on pending or paid
  const canCancel =
    order.status === 'pending' ||
    order.status === 'paid';

  // Status timeline
  const statusSteps: OrderStatus[] = [
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
  ];

  const currentStepIndex =
    statusSteps.indexOf(order.status);

  const isCancelled = order.status === 'cancelled';

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* Printable Invoice */}
      <OrderInvoice order={order} />

      {/* Normal Customer Order Details */}
      <div className="print:hidden">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
          {/* Back Link */}
          <Link
            href="/orders"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to my orders
          </Link>

          {/* Header */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                Order #{order.orderNumber}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Placed on{' '}
                {new Date(
                  order.createdAt,
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Invoice Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 sm:flex-none sm:px-4"
              >
                <FileText className="h-4 w-4" />
                Download Invoice
              </button>

              {/* Status */}
              <span
                className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${currentStatus.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {currentStatus.label}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <div className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Status
              </h2>

              {/* Mobile Timeline */}
              <div className="mt-5 overflow-x-auto pb-2 sm:hidden">
                <div className="flex min-w-[560px] items-start">
                  {statusSteps.map((status, idx) => {
                    const isPast =
                      idx <= currentStepIndex;
                    const isCurrent =
                      idx === currentStepIndex;

                    return (
                      <div
                        key={status}
                        className="flex flex-1 items-start"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                              isPast
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            } ${
                              isCurrent
                                ? 'ring-4 ring-orange-200'
                                : ''
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <p className="mt-2 text-[10px] uppercase text-gray-500">
                            {status}
                          </p>
                        </div>

                        {idx <
                          statusSteps.length - 1 && (
                          <div
                            className={`mt-4 mx-2 h-0.5 flex-1 ${
                              idx < currentStepIndex
                                ? 'bg-orange-600'
                                : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Timeline */}
              <div className="mt-4 hidden items-center sm:flex">
                {statusSteps.map((status, idx) => {
                  const isPast =
                    idx <= currentStepIndex;
                  const isCurrent =
                    idx === currentStepIndex;

                  return (
                    <div
                      key={status}
                      className="flex flex-1 items-center"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            isPast
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          } ${
                            isCurrent
                              ? 'ring-4 ring-orange-200'
                              : ''
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <p className="mt-1 text-[10px] uppercase text-gray-500 sm:text-xs">
                          {status}
                        </p>
                      </div>

                      {idx <
                        statusSteps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 ${
                            idx < currentStepIndex
                              ? 'bg-orange-600'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left - Items */}
            <div className="space-y-6 lg:col-span-2">
              {/* Items Card */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-lg">
                <div className="border-b p-4 sm:p-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Items
                  </h2>
                </div>

                <div className="divide-y">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-6"
                    >
                      <div className="flex items-center gap-3 sm:contents">
                        {/* Product Image */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-16 sm:w-16">
                          {item.product?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                item.product.images[0]
                              }
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info - Mobile */}
                        <div className="min-w-0 flex-1 sm:hidden">
                          <p className="break-words font-medium text-gray-900">
                            {item.productName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity} × ৳
                            {Number(
                              item.price,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Product Info - Desktop */}
                      <div className="hidden min-w-0 flex-1 sm:block">
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ৳
                          {Number(
                            item.price,
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* Item Total */}
                      <p className="border-t pt-3 text-right font-semibold text-gray-900 sm:border-0 sm:pt-0">
                        ৳
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t bg-gray-50 p-4 sm:p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-600">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-900">
                        ৳
                        {Number(
                          order.subtotal,
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-600">
                        Shipping
                      </span>

                      <span className="font-medium text-gray-900">
                        {Number(
                          order.shippingCost ||
                            order.shipping ||
                            0,
                        ) === 0
                          ? 'Free'
                          : `৳${Number(
                              order.shippingCost ||
                                order.shipping,
                            ).toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-t pt-2 text-base font-semibold">
                      <span>Total</span>

                      <span>
                        ৳
                        {Number(
                          order.total,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Section */}
              {canCancel && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:rounded-lg sm:p-6">
                  <h3 className="font-semibold text-red-900">
                    Cancel Order
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    You can still cancel this order.
                    Stock will be restored and any payment
                    refunded.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCancelConfirm(true)
                    }
                    disabled={cancelling}
                    className="mt-4 min-h-11 w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 sm:w-auto"
                  >
                    {cancelling
                      ? 'Cancelling...'
                      : 'Cancel Order'}
                  </button>
                </div>
              )}
            </div>

            {/* Right - Info */}
            <div className="space-y-6 lg:col-span-1">
              {/* Shipping Address */}
              <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Shipping Address
                </h2>

                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <div className="min-w-0 break-words">
                      <p>{order.shippingAddress}</p>

                      {order.shippingCity && (
                        <p>
                          {order.shippingCity}

                          {order.shippingPostal &&
                            ` - ${order.shippingPostal}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.shippingPhone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                      <span className="break-all">
                        {order.shippingPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-lg sm:p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Payment
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <CreditCard className="h-4 w-4 shrink-0 text-gray-400" />

                    <span className="text-gray-600">
                      Method:
                    </span>

                    <span className="font-medium uppercase text-gray-900">
                      {order.paymentMethod || 'COD'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:ml-6">
                    <span className="text-gray-600">
                      Status:
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.paymentStatus ===
                        'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? Stock will be restored and you will need to place a new order if you change your mind."
        confirmText={
          cancelling
            ? 'Cancelling...'
            : 'Yes, Cancel Order'
        }
        cancelText="Keep Order"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() =>
          setShowCancelConfirm(false)
        }
      />
    </main>
  );
}