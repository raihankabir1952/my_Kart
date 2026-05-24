'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, MapPin, Phone, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, refresh, loading: cartLoading } = useCart();

  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    notes: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push('/login');
  }, [user, authLoading, router]);

  const shipping = subtotal > 2000 ? 0 : 60;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.shippingAddress.trim()) {
      toast.error('Shipping address is required');
      return;
    }
    if (!form.shippingPhone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);
    try {
      // Step 1: Create order
      const orderRes = await api.post('/orders', {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: form.shippingAddress,
        shippingPhone: form.shippingPhone,
        paymentMethod: paymentMethod === 'online' ? 'sslcommerz' : 'cod',
        notes: form.notes,
      });

      const orderId = orderRes.data.id;

      // Step 2: Handle payment method
      if (paymentMethod === 'online') {
        // Initiate online payment
        const paymentRes = await api.post(`/payments/initiate/${orderId}`);

        if (paymentRes.data.paymentUrl) {
          toast.success('Redirecting to payment gateway...');
          // Cart will be cleared after successful payment
          // Redirect to SSLCommerz
          window.location.href = paymentRes.data.paymentUrl;
          return;
        } else {
          throw new Error('Payment initialization failed');
        }
      } else {
        // Cash on Delivery — order done!
        await refresh(); // refresh empty cart
        toast.success('Order placed successfully!');
        router.push(`/orders/${orderId}`);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to place order';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      setPlacing(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review your order and complete payment
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* Left - Shipping & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Shipping Information
                </h2>
              </div>

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
                    placeholder="House, Road, Area, City"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.shippingPhone}
                    onChange={(e) =>
                      setForm({ ...form, shippingPhone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Notes
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Any special instructions..."
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {/* COD Option */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-4 transition ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        Cash on Delivery
                      </p>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Available
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Pay when you receive the product
                    </p>
                  </div>
                </label>

                {/* Online Payment Option */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-4 transition ${
                    paymentMethod === 'online'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        Pay Online
                      </p>
                      <div className="flex gap-1">
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
                          bKash
                        </span>
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          Card
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Pay with bKash, Nagad, Visa, Mastercard, and more
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mt-4 space-y-3 border-b pb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {item.product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ৳
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString()}
                    </p>
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
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={placing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {placing
                  ? 'Processing...'
                  : paymentMethod === 'online'
                    ? 'Proceed to Payment'
                    : 'Place Order'}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                {paymentMethod === 'online'
                  ? '🔒 Secure payment via SSLCommerz'
                  : '💵 Cash on Delivery accepted'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}