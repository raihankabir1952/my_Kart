'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';
import CartSkeleton from '@/components/skeletons/CartSkeleton';

export default function CartPage() {
  const { user } = useAuth();
  const { items, loading, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Please login to view your cart
          </h2>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-md bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600">
            Start shopping to add items to your cart
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  const shipping = subtotal > 2000 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-orange-600"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {item.product.category}
                    </span>
                    <span className="mt-1 font-bold text-gray-900">
                      ৳{Number(item.product.price).toLocaleString()}
                    </span>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="font-semibold text-gray-900">
                      ৳
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `৳${shipping}`}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-orange-600">
                    Add ৳{(2000 - subtotal).toLocaleString()} more for free
                    shipping!
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-md bg-orange-600 px-4 py-3 text-center font-medium text-white hover:bg-orange-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Cart?"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Yes, Clear Cart"
        cancelText="Keep Items"
        variant="danger"
        onConfirm={async () => {
          await clearCart();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </main>
  );
}