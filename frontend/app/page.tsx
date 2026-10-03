'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Star,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import { Product } from '@/types/product';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

const categories = [
  {
    id: 'all',
    label: 'All',
    icon: Sparkles,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: Smartphone,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'laptop',
    label: 'Laptop',
    icon: Laptop,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: Headphones,
    gradient: 'from-green-500 to-emerald-500',
  },
];

const trustBadges = [
  {
    icon: Truck,
    label: 'Free Delivery',
    desc: 'On orders over ৳2,000',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    icon: Shield,
    label: 'Secure Payment',
    desc: 'SSL Commerz protected',
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    icon: Zap,
    label: 'Fast Shipping',
    desc: 'Get it within 3 days',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    icon: Award,
    label: 'Quality Products',
    desc: '100% authentic',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
];

interface RatingSummary {
  averageRating: number;
  totalRatings: number;
}

interface RatingUpdatedEvent {
  productId: string;
  averageRating: number;
  totalRatings: number;
}

export default function HomePage() {
  const { user } = useAuth();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('all');
  const [addingId, setAddingId] =
    useState<string | null>(null);

  const [ratings, setRatings] = useState<
    Record<string, RatingSummary>
  >({});

  const [ratingLoading, setRatingLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  useEffect(() => {
    if (products.length === 0) return;

    fetchRatings();

    const socketUrl =
      'http://localhost:4000';

    const socket: Socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log(
        'Home rating socket connected:',
        socket.id,
      );
    });

    socket.on(
      'ratingUpdated',
      (data: RatingUpdatedEvent) => {
        setRatings((currentRatings) => ({
          ...currentRatings,
          [data.productId]: {
            averageRating:
              data.averageRating,
            totalRatings:
              data.totalRatings,
          },
        }));
      },
    );

    socket.on('connect_error', (error) => {
      console.error(
        'Home rating socket connection error:',
        error,
      );
    });

    return () => {
      socket.off('connect');
      socket.off('ratingUpdated');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params: any = {};

      if (search) {
        params.search = search;
      }

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const res = await api.get<Product[]>(
        '/products',
        { params },
      );

      setProducts(res.data);
    } catch (error) {
      console.error(
        'Failed to fetch products',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setRatingLoading(true);

      const results =
        await Promise.all(
          products.map(async (product) => {
            try {
              const res =
                await api.get<RatingSummary>(
                  `/ratings/product/${product.id}`,
                );

              return {
                productId: product.id,
                averageRating:
                  res.data.averageRating,
                totalRatings:
                  res.data.totalRatings,
              };
            } catch (error) {
              console.error(
                `Failed to fetch rating for ${product.name}`,
                error,
              );

              return {
                productId: product.id,
                averageRating: 0,
                totalRatings: 0,
              };
            }
          }),
        );

      const ratingMap: Record<
        string,
        RatingSummary
      > = {};

      results.forEach((item) => {
        ratingMap[item.productId] = {
          averageRating:
            item.averageRating,
          totalRatings:
            item.totalRatings,
        };
      });

      setRatings(ratingMap);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleAddToCart = async (
    e: React.MouseEvent,
    productId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(
        'Please login to add items',
      );
      return;
    }

    setAddingId(productId);

    try {
      await addItem(productId, 1);

      toast.success(
        'Product added to cart!',
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Failed to add item to cart',
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 py-12 sm:py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-yellow-400/30 blur-3xl sm:h-72 sm:w-72" />

          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-500/40 blur-3xl sm:h-96 sm:w-96" />

          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/20 blur-3xl sm:h-64 sm:w-64" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 sm:mb-6 sm:px-4 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />

            <span className="truncate">
              Bangladesh&apos;s premium online store
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl">
            Discover Amazing{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Products
              </span>
            </span>
            <br />
            at Great Prices
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl px-2 text-sm leading-6 text-orange-50 sm:mt-5 sm:px-0 sm:text-lg sm:leading-normal">
            Shop the latest gadgets, electronics,
            and more. Fast delivery across
            Bangladesh.
          </p>

          {/* Search */}
          <div className="mx-auto mt-6 max-w-2xl sm:mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 sm:left-5" />

              <input
                type="text"
                placeholder="Search for iPhone, MacBook, headphones..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-full bg-white py-3.5 pl-12 pr-5 text-sm text-gray-900 shadow-2xl placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 sm:py-4 sm:pl-14 sm:pr-6 sm:text-base"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 divide-x divide-white/30 text-white sm:mt-10 sm:max-w-xl">
            <div className="px-2">
              <p className="text-xl font-bold sm:text-3xl">
                500+
              </p>

              <p className="mt-1 text-[10px] text-orange-100 sm:text-sm">
                Products
              </p>
            </div>

            <div className="px-2">
              <p className="text-xl font-bold sm:text-3xl">
                10K+
              </p>

              <p className="mt-1 text-[10px] text-orange-100 sm:text-sm">
                Happy Customers
              </p>
            </div>

            <div className="px-2">
              <p className="text-xl font-bold sm:text-3xl">
                4.8★
              </p>

              <p className="mt-1 text-[10px] text-orange-100 sm:text-sm">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="group flex min-w-0 items-center gap-2.5 rounded-xl p-2 transition hover:bg-gray-50 sm:gap-3 sm:p-3"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${badge.bg} transition group-hover:scale-110 sm:h-12 sm:w-12`}
                  >
                    <Icon
                      className={`h-5 w-5 ${badge.color} sm:h-6 sm:w-6`}
                      strokeWidth={2.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                      {badge.label}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-gray-500 sm:text-xs">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 sm:w-8" />

              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 sm:text-sm">
                Browse Collection
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Handpicked items just for you
            </p>
          </div>

          {/* Category Filters */}
          <div className="w-full overflow-x-auto pb-1 lg:w-auto">
            <div className="flex min-w-max gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive =
                  selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(cat.id)
                    }
                    className={`group flex flex-shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                      isActive
                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                        : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={2.5}
                    />

                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 sm:rounded-3xl sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 sm:h-20 sm:w-20">
              <Search className="h-8 w-8 text-orange-600 sm:h-10 sm:w-10" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {products.map((product) => {
              const hasDiscount =
                product.comparePrice &&
                Number(product.comparePrice) >
                  Number(product.price);

              const discountPct = hasDiscount
                ? Math.round(
                    ((Number(
                      product.comparePrice,
                    ) -
                      Number(product.price)) /
                      Number(
                        product.comparePrice,
                      )) *
                      100,
                  )
                : 0;

              const productRating =
                ratings[product.id];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/50 hover:ring-orange-200 sm:hover:-translate-y-2 sm:hover:shadow-2xl"
                >
                  {/* SALE Badge */}
                  {hasDiscount && (
                    <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg sm:left-3 sm:top-3 sm:px-2.5 sm:text-xs">
                      <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />

                      {discountPct}% OFF
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock < 5 &&
                    product.stock > 0 && (
                      <div className="absolute right-2.5 top-2.5 z-10 rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-700 ring-1 ring-yellow-200 sm:right-3 sm:top-3 sm:px-2.5 sm:text-xs">
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
                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110 sm:p-6"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 sm:text-xs">
                      {product.category}
                    </p>

                    <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-5 text-gray-900 group-hover:text-orange-600 sm:text-base">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 flex-shrink-0 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />

                      <span className="text-xs font-semibold text-gray-900 sm:text-sm">
                        {ratingLoading
                          ? '...'
                          : (
                              productRating?.averageRating ??
                              0
                            ).toFixed(1)}
                      </span>

                      <span className="text-[10px] text-gray-500 sm:text-xs">
                        (
                        {productRating?.totalRatings ??
                          0}
                        )
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-lg font-bold text-gray-900 sm:text-xl">
                        ৳
                        {Number(
                          product.price,
                        ).toLocaleString()}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through sm:text-sm">
                          ৳
                          {Number(
                            product.comparePrice,
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={(e) =>
                        handleAddToCart(
                          e,
                          product.id,
                        )
                      }
                      disabled={
                        addingId ===
                          product.id ||
                        product.stock === 0
                      }
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none sm:mt-4 sm:px-4 sm:text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />

                      {product.stock === 0
                        ? 'Out of Stock'
                        : addingId ===
                            product.id
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