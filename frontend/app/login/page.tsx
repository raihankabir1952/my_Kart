'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AuthResponse } from '@/types/user';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post<AuthResponse>(
        '/auth/login',
        form,
      );

      login(
        res.data.accessToken,
        res.data.user,
      );

      toast.success(
        `Welcome back ${res.data.user.name}!`,
      );

      router.push('/');
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.message;

      if (
        backendMessage === 'Invalid credentials' ||
        error.response?.status === 401
      ) {
        toast.error(
          'Email or password is incorrect. Please check your details and try again.',
        );
      } else {
        const msg =
          backendMessage ||
          'Unable to login. Please try again.';

        toast.error(
          Array.isArray(msg) ? msg[0] : msg,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (
    email: string,
    password: string,
  ) => {
    setForm({
      email,
      password,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-lg bg-white p-5 shadow-md sm:p-8">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Welcome Back
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Login to continue shopping
            </p>
          </div>

          {/* Testing Credentials */}
          <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <p className="text-sm font-semibold text-blue-900">
              🧪 Testing Credentials
            </p>

            <div className="mt-3 space-y-3 text-sm">
              {/* User */}
              <div className="rounded-md bg-white p-3">
                <p className="font-semibold text-gray-800">
                  User Account
                </p>

                <div className="mt-1 space-y-0.5 text-gray-600">
                  <p className="break-all">
                    Email:{' '}
                    <span className="font-medium text-gray-900">
                      user@gmail.com
                    </span>
                  </p>

                  <p>
                    Password:{' '}
                    <span className="font-medium text-gray-900">
                      123456
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials(
                      'user@gmail.com',
                      '123456',
                    )
                  }
                  className="mt-2 min-h-10 text-sm font-medium text-blue-600 hover:underline"
                >
                  Use User Credentials
                </button>
              </div>

              {/* Admin */}
              <div className="rounded-md bg-white p-3">
                <p className="font-semibold text-gray-800">
                  Admin Account
                </p>

                <div className="mt-1 space-y-0.5 text-gray-600">
                  <p className="break-all">
                    Email:{' '}
                    <span className="font-medium text-gray-900">
                      admin@gmail.com
                    </span>
                  </p>

                  <p>
                    Password:{' '}
                    <span className="font-medium text-gray-900">
                      123456
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fillCredentials(
                      'admin@gmail.com',
                      '123456',
                    )
                  }
                  className="mt-2 min-h-10 text-sm font-medium text-blue-600 hover:underline"
                >
                  Use Admin Credentials
                </button>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            {/* Email */}
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
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="••••••"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="inline-flex min-h-10 items-center text-sm font-medium text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
            >
              {loading
                ? 'Logging in...'
                : 'Login'}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-orange-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}