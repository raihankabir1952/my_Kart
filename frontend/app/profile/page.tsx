'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Phone, Edit3, Save, X } from 'lucide-react';
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

  const handleChange = (field: keyof typeof form, value: string) => {
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

      const res = await api.patch<User>('/users/profile', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-orange-500">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Top section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-orange-500 shadow-md">
                <UserIcon size={38} />
              </div>

              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-orange-100">
                  My-Kart Customer
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Update your name, email and phone number.
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={form.name}
                    disabled={!editing}
                    onChange={(e) =>
                      handleChange('name', e.target.value)
                    }
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
                      editing
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={form.email}
                    disabled={!editing}
                    onChange={(e) =>
                      handleChange('email', e.target.value)
                    }
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
                      editing
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={form.phone}
                    disabled={!editing}
                    onChange={(e) =>
                      handleChange('phone', e.target.value)
                    }
                    placeholder="Enter your phone number"
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition ${
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
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} />

                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
