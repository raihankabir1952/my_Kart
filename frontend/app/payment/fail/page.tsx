'use client';

import Link from 'next/link';
import { XCircle, RotateCcw, Home } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Failed
          </h1>

          <p className="mt-3 text-gray-600">
            Unfortunately, your payment could not be processed. Please try again
            or use a different payment method.
          </p>

          <div className="mt-6 rounded-md bg-yellow-50 p-4 text-left">
            <p className="text-sm text-yellow-800">
              <strong>What to do:</strong>
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-yellow-700">
              <li>Check your card details and try again</li>
              <li>Try a different payment method</li>
              <li>Contact your bank if the issue persists</li>
              <li>Your order has been saved — you can retry payment from order details</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="flex items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4" />
              View Orders
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}