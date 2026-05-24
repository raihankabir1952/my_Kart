'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus, ShoppingCart, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get<Product>(`/products/slug/${slug}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;

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
    product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const outOfStock = product.stock === 0;

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
            <p className="text-sm uppercase text-gray-500">{product.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ৳{Number(product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ৳{Number(product.comparePrice).toLocaleString()}
                  </span>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    SALE
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-700">{product.description}</p>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Stock:{' '}
                <span
                  className={
                    product.stock > 0 ? 'font-medium text-green-700' : 'text-red-600'
                  }
                >
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            {!outOfStock && (
              <div className="mt-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center rounded-md border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {outOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}