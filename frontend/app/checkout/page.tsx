'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Phone, FileText, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types/order';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, refresh } = useCart();
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login first');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Empty cart redirect
  useEffect(() => {
    if (user && items.length === 0 && !placing) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [items, user, router, placing]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  const shipping = subtotal > 2000 ? 0 : 60;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.shippingAddress.trim().length < 10) {
      toast.error('Please enter a complete shipping address');
      return;
    }
    if (form.shippingPhone.trim().length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setPlacing(true);
    try {
      // Cart items theke order items prepare
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const res = await api.post<Order>('/orders', {
        items: orderItems,
        shippingAddress: form.shippingAddress,
        shippingPhone: form.shippingPhone,
        paymentMethod: form.paymentMethod,
        notes: form.notes || undefined,
      });

      // Order successful - clear cart
      await api.delete('/cart');
      await refresh();

      toast.success('Order placed successfully!');
      router.push(`/orders/${res.data.id}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to place order';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-gray-900">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MapPin className="h-5 w-5 text-orange-600" />
                Shipping Information
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.shippingAddress}
                    onChange={(e) =>
                      setForm({ ...form, shippingAddress: e.target.value })
                    }
                    placeholder="House 12, Road 5, Dhanmondi, Dhaka 1205"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative mt-1">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={form.shippingPhone}
                      onChange={(e) =>
                        setForm({ ...form, shippingPhone: e.target.value })
                      }
                      placeholder="01700000000"
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Payment Method
              </h2>

              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:border-orange-500">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={form.paymentMethod === 'cash_on_delivery'}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="h-4 w-4 text-orange-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                <label className="flex cursor-not-allowed items-center gap-3 rounded-md border border-gray-200 p-3 opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    disabled
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-orange-600" />
                Order Notes (optional)
              </h2>

              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special instructions for delivery..."
                className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              {/* Items list */}
              <div className="mt-4 space-y-3 border-b pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-gray-500">
                        Qty: {item.quantity} × ৳
                        {Number(item.product.price).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-medium">
                      ৳
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `৳${shipping}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="mt-6 w-full rounded-md bg-orange-600 px-4 py-3 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                By placing order, you agree to our terms
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}