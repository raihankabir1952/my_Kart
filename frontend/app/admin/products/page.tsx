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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Package className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Manage your store inventory
            </p>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Category
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600">
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
                      {search ? 'No products match your search' : 'No products yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="group transition hover:bg-orange-50/30"
                  >
                    <td className="px-6 py-4">
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
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-blue-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">
                        ৳{Number(product.price).toLocaleString()}
                      </p>
                      {product.comparePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳{Number(product.comparePrice).toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
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