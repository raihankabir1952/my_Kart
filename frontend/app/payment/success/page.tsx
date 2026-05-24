'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();
  const { refresh } = useCart();
  const [countdown, setCountdown] = useState(5);

  // Clear cart after payment (with delay to ensure backend processed)
  useEffect(() => {
    const timer = setTimeout(() => {
      refresh();
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer (just decrements)
  useEffect(() => {
    if (!orderId) return;
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, orderId]);

  // Separate effect: redirect when countdown reaches 0
  useEffect(() => {
    if (!orderId) return;
    if (countdown === 0) {
      router.push(`/orders/${orderId}`);
    }
  }, [countdown, orderId, router]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will
            be processed soon.
          </p>

          {orderId && countdown > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to order details in{' '}
              <span className="font-bold text-orange-600">{countdown}</span>{' '}
              seconds...
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {orderId && (
              <Link
                href={`/orders/${orderId}`}
                className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
              >
                <Package className="h-4 w-4" />
                View Order
              </Link>
            )}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}