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
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-400" />

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm uppercase text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                <span className="ml-1 text-lg font-semibold text-gray-900">
                  {ratingFetching
                    ? '...'
                    : averageRating.toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                ({totalRatings}{' '}
                {totalRatings === 1
                  ? 'rating'
                  : 'ratings'})
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ৳
                {Number(
                  product.price,
                ).toLocaleString()}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ৳
                    {Number(
                      product.comparePrice,
                    ).toLocaleString()}
                  </span>

                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    SALE
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-700">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Stock:{' '}
                <span
                  className={
                    product.stock > 0
                      ? 'font-medium text-green-700'
                      : 'text-red-600'
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* User Rating */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRating
                  ? 'Your Rating'
                  : 'Rate This Product'}
              </h2>

              {!user ? (
                <p className="mt-2 text-sm text-gray-600">
                  Please login to rate this product.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex items-center gap-1">
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
                            className="rounded p-1 transition hover:scale-110"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`h-7 w-7 ${active
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          </button>
                        );
                      },
                    )}
                  </div>

                  {userRating > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      You rated this product{' '}
                      <span className="font-medium text-gray-900">
                        {userRating}/5
                      </span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={
                      handleRatingSubmit
                    }
                    disabled={
                      ratingLoading ||
                      selectedRating === 0
                    }
                    className="mt-4 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {ratingLoading
                      ? 'Saving...'
                      : userRating
                        ? 'Update Rating'
                        : 'Submit Rating'}
                  </button>

                  <p className="mt-3 text-xs text-gray-500">
                    Only customers who purchased this
                    product can submit a rating.
                  </p>
                </>
              )}
            </div>

            {/* Quantity */}
            {!outOfStock && (
              <div className="mt-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>

                <div className="flex items-center rounded-md border border-gray-300">
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1,
                        ),
                      )
                    }
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>

                  <button
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
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={
                outOfStock || adding
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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