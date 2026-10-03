'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  ImageOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import AdminTableSkeleton from '@/components/skeletons/AdminTableSkeleton';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get<Product[]>('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <AdminTableSkeleton />;

  return (
    <div className="min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 sm:h-14 sm:w-14 sm:rounded-2xl">
            <Package
              className="h-5 w-5 text-white sm:h-7 sm:w-7"
              strokeWidth={2.5}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
              Products
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Manage your store inventory
            </p>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02] hover:shadow-xl sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-200 sm:mb-6 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Desktop Products Table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 lg:px-6">
                  Product
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 lg:px-6">
                  Category
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 lg:px-6">
                  Price
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 lg:px-6">
                  Stock
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-300" />

                    <p className="mt-3 text-sm text-gray-500">
                      {search
                        ? 'No products match your search'
                        : 'No products yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="group transition hover:bg-orange-50/30"
                  >
                    {/* Product */}
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageOff className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 max-w-[260px]">
                          <p className="truncate font-semibold text-gray-900">
                            {product.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 lg:px-6">
                      <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-blue-700">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-right lg:px-6">
                      <p className="font-bold text-gray-900">
                        ৳{Number(product.price).toLocaleString()}
                      </p>

                      {product.comparePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳{Number(product.comparePrice).toLocaleString()}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-right lg:px-6">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteId(product.id)}
                          aria-label={`Delete ${product.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Product Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm ring-1 ring-gray-200">
            <Package className="mx-auto h-12 w-12 text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              {search
                ? 'No products match your search'
                : 'No products yet'}
            </p>
          </div>
        ) : (
          filtered.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
            >
              {/* Product Header */}
              <div className="flex min-w-0 items-start gap-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageOff className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 text-sm font-bold text-gray-900">
                    {product.name}
                  </h2>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {product.slug}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-blue-700">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Price
                  </p>

                  <p className="mt-1 text-base font-bold text-gray-900">
                    ৳{Number(product.price).toLocaleString()}
                  </p>

                  {product.comparePrice && (
                    <p className="text-xs text-gray-400 line-through">
                      ৳{Number(product.comparePrice).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Stock
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>

                <button
                  onClick={() => setDeleteId(product.id)}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}