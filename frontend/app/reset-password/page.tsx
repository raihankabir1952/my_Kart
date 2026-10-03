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

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h1 className="text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or
              incomplete.
            </p>

            <Link
              href="/forgot-password"
              className="mt-6 inline-block text-sm font-medium text-orange-600 hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? 'Resetting...'
                : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-orange-600 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
