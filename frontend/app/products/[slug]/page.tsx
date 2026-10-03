'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Minus,
  Plus,
  ShoppingCart,
  Package,
  Star,
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';

interface Rating {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface RatingResponse {
  averageRating: number;
  totalRatings: number;
  ratings: Rating[];
}

interface RatingUpdatedEvent {
  productId: string;
  averageRating: number;
  totalRatings: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Rating states
  const [averageRating, setAverageRating] =
    useState(0);

  const [totalRatings, setTotalRatings] =
    useState(0);

  const [selectedRating, setSelectedRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [userRating, setUserRating] =
    useState(0);

  const [ratingLoading, setRatingLoading] =
    useState(false);

  const [ratingFetching, setRatingFetching] =
    useState(false);

  // Fetch product
  useEffect(() => {
    if (!slug) return;

    fetchProduct();
  }, [slug]);

  // Fetch ratings
  useEffect(() => {
    if (!product) return;

    fetchRatings();

    if (user) {
      fetchUserRating();
    } else {
      setUserRating(0);
      setSelectedRating(0);
    }
  }, [product?.id, user?.id]);

  // Real-time rating updates
  useEffect(() => {
    if (!product?.id) return;

    const socket: Socket = io(
      'http://localhost:4000',
      {
        path: '/socket.io',
        transports: ['websocket'],
      },
    );

    socket.on('connect', () => {
      console.log(
        'Rating socket connected:',
        socket.id,
      );
    });

    socket.on(
      'ratingUpdated',
      (data: RatingUpdatedEvent) => {
        if (data.productId !== product.id) {
          return;
        }

        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      },
    );

    socket.on('connect_error', (error) => {
      console.error(
        'Rating socket connection error:',
        error,
      );
    });

    return () => {
      socket.off('connect');
      socket.off('ratingUpdated');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [product?.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await api.get<Product>(
        `/products/slug/${slug}`,
      );

      setProduct(res.data);
    } catch (error) {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    if (!product) return;

    try {
      setRatingFetching(true);

      const res =
        await api.get<RatingResponse>(
          `/ratings/product/${product.id}`,
        );

      setAverageRating(
        res.data.averageRating,
      );

      setTotalRatings(
        res.data.totalRatings,
      );
    } catch (error) {
      console.error(
        'Failed to fetch ratings:',
        error,
      );
    } finally {
      setRatingFetching(false);
    }
  };

  const fetchUserRating = async () => {
    if (!product || !user) return;

    try {
      const res =
        await api.get<Rating | null>(
          `/ratings/product/${product.id}/me`,
        );

      if (res.data) {
        setUserRating(res.data.rating);
        setSelectedRating(
          res.data.rating,
        );
      } else {
        setUserRating(0);
        setSelectedRating(0);
      }
    } catch (error) {
      console.error(
        'Failed to fetch user rating:',
        error,
      );
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      toast.error(
        'Please login to rate this product.',
      );
      return;
    }

    if (!product) return;

    if (
      selectedRating < 1 ||
      selectedRating > 5
    ) {
      toast.error(
        'Please select a rating from 1 to 5.',
      );
      return;
    }

    setRatingLoading(true);

    try {
      await api.post('/ratings', {
        productId: product.id,
        rating: selectedRating,
      });

      setUserRating(selectedRating);

      await fetchRatings();

      toast.success(
        userRating
          ? 'Your rating has been updated!'
          : 'Thanks for rating this product!',
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Unable to submit rating.';

      toast.error(
        Array.isArray(message)
          ? message[0]
          : message,
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(
        'Please login to add to cart',
      );
      return;
    }

    if (!product) return;

    setAdding(true);

    try {
      await addItem(
        product.id,
        quantity,
      );

      toast.success(
        `${quantity} item(s) added to cart!`,
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Failed to add',
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <Package className="mx-auto h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Product not found
          </h2>
        </div>
      </main>
    );
  }

  const hasDiscount =
    product.comparePrice &&
    Number(product.comparePrice) >
      Number(product.price);

  const outOfStock =
    product.stock === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          {/* ================= IMAGE ================= */}
          <div className="self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-3xl">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-contain p-5 sm:p-8 lg:p-10"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}
            </div>
          </div>

          {/* ================= PRODUCT INFO ================= */}
          <div className="min-w-0">
            {/* Category */}
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 sm:text-sm">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                <span className="ml-1 text-base font-semibold text-gray-900 sm:text-lg">
                  {ratingFetching
                    ? '...'
                    : averageRating.toFixed(1)}
                </span>
              </div>

              <span className="text-xs text-gray-500 sm:text-sm">
                ({totalRatings}{' '}
                {totalRatings === 1
                  ? 'rating'
                  : 'ratings'})
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
                ৳
                {Number(
                  product.price,
                ).toLocaleString()}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-base text-gray-400 line-through sm:text-lg">
                    ৳
                    {Number(
                      product.comparePrice,
                    ).toLocaleString()}
                  </span>

                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700 sm:text-xs">
                    SALE
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-5 border-t border-gray-200 pt-5 sm:mt-6 sm:pt-6">
              <p className="whitespace-pre-line text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <div className="mt-5">
              <p className="text-sm text-gray-600">
                Stock:{' '}
                <span
                  className={
                    product.stock > 0
                      ? 'font-semibold text-green-700'
                      : 'font-semibold text-red-600'
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* ================= USER RATING ================= */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:mt-8 sm:p-5">
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                {userRating
                  ? 'Your Rating'
                  : 'Rate This Product'}
              </h2>

              {!user ? (
                <p className="mt-2 text-sm leading-5 text-gray-600">
                  Please login to rate this product.
                </p>
              ) : (
                <>
                  {/* Stars */}
                  <div className="mt-3 flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => {
                        const active =
                          star <=
                          (hoverRating ||
                            selectedRating);

                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setSelectedRating(
                                star,
                              )
                            }
                            onMouseEnter={() =>
                              setHoverRating(
                                star,
                              )
                            }
                            onMouseLeave={() =>
                              setHoverRating(0)
                            }
                            className="rounded-md p-1.5 transition hover:scale-110 sm:p-1"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`h-6 w-6 sm:h-7 sm:w-7 ${
                                active
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* User rating text */}
                  {userRating > 0 && (
                    <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                      You rated this product{' '}
                      <span className="font-medium text-gray-900">
                        {userRating}/5
                      </span>
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={
                      handleRatingSubmit
                    }
                    disabled={
                      ratingLoading ||
                      selectedRating === 0
                    }
                    className="mt-4 w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:py-2.5"
                  >
                    {ratingLoading
                      ? 'Saving...'
                      : userRating
                        ? 'Update Rating'
                        : 'Submit Rating'}
                  </button>

                  <p className="mt-3 text-[11px] leading-4 text-gray-500 sm:text-xs">
                    Only customers who purchased this
                    product can submit a rating.
                  </p>
                </>
              )}
            </div>

            {/* ================= QUANTITY ================= */}
            {!outOfStock && (
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <label className="text-sm font-semibold text-gray-700">
                  Quantity:
                </label>

                <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1,
                        ),
                      )
                    }
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="flex h-10 w-12 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stock,
                          quantity + 1,
                        ),
                      )
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                    className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= ADD TO CART ================= */}
            <button
              onClick={handleAddToCart}
              disabled={
                outOfStock || adding
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:mt-6 sm:py-3"
            >
              <ShoppingCart className="h-5 w-5" />

              {outOfStock
                ? 'Out of Stock'
                : adding
                  ? 'Adding...'
                  : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}