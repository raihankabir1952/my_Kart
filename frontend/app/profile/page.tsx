'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User } from '@/types/user';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!form.email.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch<User>(
        '/users/profile',
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
      );

      updateUser(res.data);
      setEditing(false);

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update failed:', error);

      const message =
        error?.response?.data?.message ||
        'Failed to update profile';

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }

    setEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-orange-500">
            My Account
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-2xl">
          {/* Top Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-orange-500 shadow-md sm:h-20 sm:w-20">
                <UserIcon
                  size={32}
                  className="sm:hidden"
                />

                <UserIcon
                  size={38}
                  className="hidden sm:block"
                />
              </div>

              <div className="min-w-0 text-white">
                <h2 className="truncate text-xl font-bold sm:text-2xl">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-orange-100">
                  My-Kart Customer
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-8">
            {/* Section Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Update your name, email and phone number.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 sm:w-auto"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    value={form.name}
                    disabled={!editing}
                    autoComplete="name"
                    onChange={(e) =>
                      handleChange(
                        'name',
                        e.target.value,
                      )
                    }
                    className={`min-h-11 w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition sm:text-base ${
                      editing
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    value={form.email}
                    disabled={!editing}
                    autoComplete="email"
                    inputMode="email"
                    onChange={(e) =>
                      handleChange(
                        'email',
                        e.target.value,
                      )
                    }
                    className={`min-h-11 w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition sm:text-base ${
                      editing
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="profile-phone"
                    type="tel"
                    value={form.phone}
                    disabled={!editing}
                    autoComplete="tel"
                    inputMode="tel"
                    onChange={(e) =>
                      handleChange(
                        'phone',
                        e.target.value,
                      )
                    }
                    placeholder="Enter your phone number"
                    className={`min-h-11 w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition sm:text-base ${
                      editing
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            {editing && (
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Save size={16} />

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}