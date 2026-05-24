'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

const CATEGORIES = ['All', 'mobile', 'laptop', 'audio'];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category !== 'All') params.category = category;
      const res = await api.get<Product[]>('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await addItem(productId, 1);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Welcome to MyKart</h1>
          <p className="mt-4 text-lg text-orange-100">
            Discover amazing products at great prices
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">
              {search ? `No products match "${search}"` : 'No products found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => {
              const hasDiscount =
                product.comparePrice &&
                Number(product.comparePrice) > Number(product.price);
              const outOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block aspect-square overflow-hidden bg-gray-100"
                  >
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
                  </Link>

                  <div className="p-4">
                    <p className="text-xs uppercase text-gray-500">
                      {product.category}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-1 block font-semibold text-gray-900 hover:text-orange-600"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ৳{Number(product.price).toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{Number(product.comparePrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {hasDiscount && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          SALE
                        </span>
                      )}
                      {outOfStock && (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={outOfStock}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}