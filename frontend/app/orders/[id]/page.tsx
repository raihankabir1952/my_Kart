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
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Order, OrderStatus } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-700 bg-yellow-100', icon: Clock },
  paid: { label: 'Paid', color: 'text-blue-700 bg-blue-100', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-indigo-700 bg-indigo-100', icon: Package },
  shipped: { label: 'Shipped', color: 'text-purple-700 bg-purple-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-700 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-100', icon: XCircle },
};

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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
      const res = await api.patch<Order>(`/orders/${id}/cancel`);
      setOrder(res.data);
      toast.success('Order cancelled successfully');
      setShowCancelConfirm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Order not found</h2>
          <Link
            href="/orders"
            className="mt-6 inline-block text-orange-600 hover:underline"
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
  const canCancel = order.status === 'pending' || order.status === 'paid';

  // Status timeline
  const statusSteps: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my orders
        </Link>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${currentStatus.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {currentStatus.label}
          </span>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Status</h2>
            <div className="mt-4 flex items-center justify-between">
              {statusSteps.map((status, idx) => {
                const isPast = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={status} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          isPast
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        } ${isCurrent ? 'ring-4 ring-orange-200' : ''}`}
                      >
                        {idx + 1}
                      </div>
                      <p className="mt-1 text-[10px] uppercase text-gray-500 sm:text-xs">
                        {status}
                      </p>
                    </div>
                    {idx < statusSteps.length - 1 && (
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

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left - Items */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-base font-semibold text-gray-900">Items</h2>
              </div>

              <div className="divide-y">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-6">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {item.product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ৳
                        {Number(item.price).toLocaleString()}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      ৳{(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t bg-gray-50 p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>৳{Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {Number(order.shippingCost || order.shipping || 0) === 0
                        ? 'Free'
                        : `৳${Number(order.shippingCost || order.shipping).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span>৳{Number(order.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Section */}
            {canCancel && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <h3 className="font-semibold text-red-900">Cancel Order</h3>
                <p className="mt-1 text-sm text-red-700">
                  You can still cancel this order. Stock will be restored and any payment refunded.
                </p>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelling}
                  className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="space-y-6 lg:col-span-1">
            {/* Shipping Address */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">
                Shipping Address
              </h2>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div>
                    <p>{order.shippingAddress}</p>
                    {order.shippingCity && (
                      <p>
                        {order.shippingCity}
                        {order.shippingPostal && ` - ${order.shippingPostal}`}
                      </p>
                    )}
                  </div>
                </div>
                {order.shippingPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span>{order.shippingPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Payment</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium uppercase text-gray-900">
                    {order.paymentMethod || 'COD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? Stock will be restored and you will need to place a new order if you change your mind."
        confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
        cancelText="Keep Order"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </main>
  );
}