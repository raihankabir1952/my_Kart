'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  CreditCard,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    items,
    subtotal,
    refresh,
    loading: cartLoading,
  } = useCart();

  const [placing, setPlacing] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<'cod' | 'online'>('cod');

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingPhone: '',
    notes: '',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const shipping =
    subtotal > 2000 ? 0 : 60;

  const total = subtotal + shipping;

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!form.shippingAddress.trim()) {
      toast.error(
        'Shipping address is required',
      );
      return;
    }

    if (!form.shippingPhone.trim()) {
      toast.error(
        'Phone number is required',
      );
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);

    try {
      // Step 1: Create order
      const orderRes = await api.post(
        '/orders',
        {
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          shippingAddress:
            form.shippingAddress,
          shippingPhone:
            form.shippingPhone,
          paymentMethod:
            paymentMethod === 'online'
              ? 'sslcommerz'
              : 'cod',
          notes: form.notes,
        },
      );

      const orderId = orderRes.data.id;

      // Step 2: Handle payment method
      if (paymentMethod === 'online') {
        const paymentRes =
          await api.post(
            `/payments/initiate/${orderId}`,
          );

        if (paymentRes.data.paymentUrl) {
          toast.success(
            'Redirecting to payment gateway...',
          );

          // Cart will be cleared after
          // successful payment
          window.location.href =
            paymentRes.data.paymentUrl;

          return;
        }

        throw new Error(
          'Payment initialization failed',
        );
      } else {
        // Cash on Delivery
        await refresh();

        toast.success(
          'Order placed successfully!',
        );

        router.push(
          `/orders/${orderId}`,
        );
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        'Failed to place order';

      toast.error(
        Array.isArray(msg)
          ? msg[0]
          : msg,
      );

      setPlacing(false);
    }
  };

  // ================= LOADING =================

  if (authLoading || cartLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-7 w-32 rounded bg-gray-200" />

            <div className="mt-2 h-4 w-64 rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-72 rounded-2xl bg-white" />
                <div className="h-56 rounded-2xl bg-white" />
              </div>

              <div className="h-96 rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // ================= EMPTY CART =================

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <ShoppingBag className="mx-auto h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Add some products before proceeding
            to checkout.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:text-base"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* ================= PAGE HEADER ================= */}

        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            Review your order and complete
            payment
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {/* ================= LEFT SIDE ================= */}

          <div className="min-w-0 space-y-5 lg:col-span-2 lg:space-y-6">
            {/* ================= SHIPPING ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>

                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Shipping Information
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                {/* Address */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Address *
                  </label>

                  <textarea
                    required
                    rows={4}
                    value={
                      form.shippingAddress
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shippingAddress:
                          e.target.value,
                      })
                    }
                    placeholder="House, Road, Area, City"
                    className="mt-1.5 block w-full resize-y rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-base"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    required
                    value={
                      form.shippingPhone
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shippingPhone:
                          e.target.value,
                      })
                    }
                    placeholder="01XXXXXXXXX"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-base"
                  />
                </div>

                {/* Notes */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Notes
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Any special instructions..."
                    className="mt-1.5 block w-full resize-y rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* ================= PAYMENT ================= */}

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>

                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Payment Method
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                {/* ================= COD ================= */}

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition sm:p-4 ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={
                      paymentMethod ===
                      'cod'
                    }
                    onChange={() =>
                      setPaymentMethod(
                        'cod',
                      )
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-orange-600"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900 sm:text-base">
                        Cash on Delivery
                      </p>

                      <span className="w-fit rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 sm:text-xs">
                        Available
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Pay when you receive the
                      product
                    </p>
                  </div>
                </label>

                {/* ================= ONLINE ================= */}

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition sm:p-4 ${
                    paymentMethod ===
                    'online'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={
                      paymentMethod ===
                      'online'
                    }
                    onChange={() =>
                      setPaymentMethod(
                        'online',
                      )
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-orange-600"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900 sm:text-base">
                        Pay Online
                      </p>

                      <div className="flex flex-wrap gap-1">
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700 sm:text-xs">
                          bKash
                        </span>

                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 sm:text-xs">
                          Card
                        </span>
                      </div>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Pay with bKash, Nagad, Visa,
                      Mastercard, and more
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="min-w-0 lg:col-span-1">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              {/* ================= ITEMS ================= */}

              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto border-b border-gray-200 pb-4 pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 text-sm"
                  >
                    {/* Image */}

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            item.product
                              .images[0]
                          }
                          alt={
                            item.product
                              .name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Name */}

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium leading-4 text-gray-900 sm:text-sm">
                        {item.product.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}

                    <p className="shrink-0 text-xs font-semibold text-gray-900 sm:text-sm">
                      ৳
                      {(
                        Number(
                          item.product.price,
                        ) *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* ================= TOTALS ================= */}

              <div className="mt-4 space-y-3">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? 'Free'
                      : `৳${shipping}`}
                  </span>
                </div>

                {subtotal < 2000 && (
                  <div className="rounded-lg bg-orange-50 px-3 py-2">
                    <p className="text-xs leading-5 text-orange-600">
                      Add ৳
                      {(
                        2000 - subtotal
                      ).toLocaleString()}{' '}
                      more for free shipping!
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold">
                  <span className="text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ৳
                    {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ================= PLACE ORDER ================= */}

              <button
                type="submit"
                disabled={placing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none sm:mt-6 sm:py-3"
              >
                {placing
                  ? 'Processing...'
                  : paymentMethod ===
                      'online'
                    ? 'Proceed to Payment'
                    : 'Place Order'}
              </button>

              {/* Payment message */}

              <p className="mt-3 text-center text-[11px] leading-4 text-gray-500 sm:text-xs">
                {paymentMethod ===
                'online'
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
