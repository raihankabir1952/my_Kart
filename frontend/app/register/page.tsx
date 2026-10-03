'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AuthResponse } from '@/types/user';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post<AuthResponse>(
        '/auth/register',
        form,
      );

      login(res.data.accessToken, res.data.user);

      toast.success(`Welcome ${res.data.user.name}!`);

      router.push('/');
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        'Registration failed';

      toast.error(
        Array.isArray(msg) ? msg[0] : msg,
      );
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
              Create Account
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Join MyKart and start shopping!
            </p>
          </div>

          {/* Register Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="John Doe"
              />
            </div>

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
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="At least 6 characters"
              />

              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone{' '}
                <span className="font-normal text-gray-500">
                  (optional)
                </span>
              </label>

              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                className="mt-1 min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-base"
                placeholder="01700000000"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center font-medium text-orange-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}