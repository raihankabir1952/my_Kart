'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid or missing reset link.');
      return;
    }

    if (password.length < 6) {
      toast.error(
        'Password must be at least 6 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });

      toast.success(
        'Password reset successfully! Please login.',
      );

      router.push('/login');
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.message;

      const message = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage ||
          'Unable to reset password. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* Invalid / Missing Token */
  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-lg bg-white p-5 text-center shadow-md sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Invalid Reset Link
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              This password reset link is invalid or
              incomplete.
            </p>

            <Link
              href="/forgot-password"
              className="mt-6 inline-flex min-h-10 items-center text-sm font-medium text-orange-600 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-lg bg-white p-5 shadow-md sm:p-8">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Reset Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enter your new password below.
            </p>
          </div>

          {/* Reset Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="Enter new password"
              />

              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
            >
              {loading
                ? 'Resetting...'
                : 'Reset Password'}
            </button>
          </form>

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