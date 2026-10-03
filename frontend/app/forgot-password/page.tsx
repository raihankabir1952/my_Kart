'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', {
        email,
      });

      setSent(true);

      toast.success(
        'If an account exists, a reset link has been sent to your email.',
      );
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.message;

      const message = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage ||
          'Unable to process your request. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-lg bg-white p-5 shadow-md sm:p-8">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enter your email address and we&apos;ll send
              you a link to reset your password.
            </p>
          </div>

          {/* Email Service Limitation */}
          <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm leading-6 text-yellow-800 sm:p-4">
            <p className="font-medium">
              ⚠️ Demo Notice
            </p>

            <p className="mt-1">
              Password reset email delivery is currently
              limited by the email service&apos;s testing
              configuration. The reset feature is available
              for demonstration purposes.
            </p>
          </div>

          {/* Success State */}
          {sent ? (
            <div className="mt-6 rounded-md bg-green-50 p-4 text-sm leading-6 text-green-700">
              <p className="font-medium">
                Check your email
              </p>

              <p className="mt-1">
                If an account exists with this email,
                you&apos;ll receive a password reset link.
              </p>
            </div>
          ) : (
            /* Reset Form */
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="min-h-11 w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center text-sm font-medium text-orange-600 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}