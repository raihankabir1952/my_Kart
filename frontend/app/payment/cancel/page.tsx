'use client';

import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-12 w-12 text-yellow-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Cancelled
          </h1>

          <p className="mt-3 text-gray-600">
            You cancelled the payment. Your order is still saved and you can
            complete payment anytime from your orders.
          </p>

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