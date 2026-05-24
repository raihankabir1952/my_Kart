'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  Smartphone,
  Laptop,
  Headphones,
  Sparkles,
  Truck,
  Shield,
  Zap,
  Award,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

const categories = [
  { id: 'all', label: 'All', icon: Sparkles, gradient: 'from-orange-500 to-red-500' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, gradient: 'from-blue-500 to-indigo-500' },
  { id: 'laptop', label: 'Laptop', icon: Laptop, gradient: 'from-purple-500 to-pink-500' },
  { id: 'audio', label: 'Audio', icon: Headphones, gradient: 'from-green-500 to-emerald-500' },
];

const trustBadges = [
  { icon: Truck, label: 'Free Delivery', desc: 'On orders over ৳2,000', color: 'text-blue-600', bg: 'bg-blue-100' },
  { icon: Shield, label: 'Secure Payment', desc: 'SSL Commerz protected', color: 'text-green-600', bg: 'bg-green-100' },
  { icon: Zap, label: 'Fast Shipping', desc: 'Get it within 3 days', color: 'text-orange-600', bg: 'bg-orange-100' },
  { icon: Award, label: 'Quality Products', desc: '100% authentic', color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function HomePage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const res = await api.get<Product[]>('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items');
      return;
    }
    setAddingId(productId);
    await addItem(productId, 1);
    setAddingId(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 py-20">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/30 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-pink-500/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
            <Sparkles className="h-4 w-4" />
            Bangladesh's premium online store
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Discover Amazing{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Products
              </span>
            </span>
            <br />
            at Great Prices
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-orange-50">
            Shop the latest gadgets, electronics, and more.
            Fast delivery across Bangladesh.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for iPhone, MacBook, headphones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full bg-white py-4 pl-14 pr-6 text-base text-gray-900 shadow-2xl placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white sm:gap-12">
            <div>
              <p className="text-2xl font-bold sm:text-3xl">500+</p>
              <p className="text-xs text-orange-100 sm:text-sm">Products</p>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <p className="text-2xl font-bold sm:text-3xl">10K+</p>
              <p className="text-xs text-orange-100 sm:text-sm">Happy Customers</p>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <p className="text-2xl font-bold sm:text-3xl">4.8★</p>
              <p className="text-xs text-orange-100 sm:text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                >
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${badge.bg} transition group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${badge.color}`} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {badge.label}
                    </p>
                    <p className="text-xs text-gray-500">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories + Products */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {/* Section header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Browse Collection
              </p>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked items just for you
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                      : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100">
              <Search className="h-10 w-10 text-orange-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-gray-500">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const hasDiscount =
                product.comparePrice &&
                Number(product.comparePrice) > Number(product.price);
              const discountPct = hasDiscount
                ? Math.round(
                    ((Number(product.comparePrice) - Number(product.price)) /
                      Number(product.comparePrice)) *
                      100,
                  )
                : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-200/50 hover:ring-orange-200"
                >
                  {/* SALE Badge */}
                  {hasDiscount && (
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      <Tag className="h-3 w-3" />
                      {discountPct}% OFF
                    </div>
                  )}

                  {/* Stock badge */}
                  {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute right-3 top-3 z-10 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700 ring-1 ring-yellow-200">
                      Only {product.stock} left
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {product.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900 group-hover:text-orange-600">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ৳{Number(product.price).toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{Number(product.comparePrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={addingId === product.id || product.stock === 0}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock === 0
                        ? 'Out of Stock'
                        : addingId === product.id
                          ? 'Adding...'
                          : 'Add to Cart'}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}