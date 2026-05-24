'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import ImageUpload from '@/components/ImageUpload';

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  category: string;
  images: string[];
  isActive: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '0',
    category: 'general',
    images: [],
    isActive: true,
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
      .replace(/\s+/g, '-')           // spaces to dashes
      .replace(/-+/g, '-');           // multiple dashes to single
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: generateSlug(name), // auto update slug
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category.trim() || 'general',
        images: form.images,
        isActive: form.isActive,
      };

      // Only include comparePrice if provided
      if (form.comparePrice && Number(form.comparePrice) > 0) {
        payload.comparePrice = Number(form.comparePrice);
      }

      await api.post<Product>('/products', payload);
      toast.success('Product created!');
      router.push('/admin/products');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create product';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Add New Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Main info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug *
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (auto-generated, URL-friendly)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="iphone-15-pro-max"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Detailed product description..."
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Images</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload product photos. First image will be the main display.
            </p>
            <div className="mt-4">
              <ImageUpload
                value={form.images}
                onChange={(images) => setForm({ ...form, images })}
                maxImages={5}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Pricing</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compare Price (৳)
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (optional)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) =>
                    setForm({ ...form, comparePrice: e.target.value })
                  }
                  placeholder="Original price"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Set compare price to show discount (e.g. ~~৳160,000~~ ৳145,000)
            </p>
          </div>
        </div>

        {/* Right: Side info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Status */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Status</h2>

            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Active</p>
                <p className="text-xs text-gray-500">
                  Visible to customers in the store
                </p>
              </div>
            </label>
          </div>

          {/* Inventory */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Inventory</h2>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Set to 0 if unlimited
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Category</h2>

            <div className="mt-4">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="general">General</option>
                <option value="mobile">Mobile</option>
                <option value="laptop">Laptop</option>
                <option value="audio">Audio</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <Link
              href="/admin/products"
              className="mt-3 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}