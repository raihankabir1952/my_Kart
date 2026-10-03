'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/ConfirmModal';
import CartSkeleton from '@/components/skeletons/CartSkeleton';

export default function CartPage() {
  const { user } = useAuth();

  const {
    items,
    loading,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] =
    useState(false);

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <ShoppingBag className="mx-auto h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Please login to view your cart
          </h2>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:text-base"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <ShoppingBag className="mx-auto h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />

          <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Start shopping to add items to your cart
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:text-base"
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
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Shopping Cart
            </h1>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {items.length}{' '}
              {items.length === 1 ? 'item' : 'items'} in
              your cart
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowClearConfirm(true)
            }
            className="shrink-0 text-xs font-medium text-red-600 transition hover:text-red-700 hover:underline sm:text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ================= CART ITEMS ================= */}
          <div className="min-w-0 lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4"
                >
                  {/* Product row */}
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                      {item.product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400 sm:text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition hover:text-orange-600 sm:text-base"
                      >
                        {item.product.name}
                      </Link>

                      <span className="mt-1 block truncate text-xs text-gray-500 sm:text-sm">
                        {item.product.category}
                      </span>

                      <span className="mt-1.5 block text-sm font-bold text-gray-900 sm:text-base">
                        ৳
                        {Number(
                          item.product.price,
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* Desktop Subtotal + Remove */}
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-xs text-gray-500">
                        Subtotal
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        ৳
                        {(
                          Number(
                            item.product.price,
                          ) * item.quantity
                        ).toLocaleString()}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        className="mt-3 inline-flex items-center gap-1 text-xs text-red-600 transition hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* ================= MOBILE SUBTOTAL ================= */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 sm:hidden">
                    <div>
                      <p className="text-[11px] text-gray-500">
                        Item Subtotal
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        ৳
                        {(
                          Number(
                            item.product.price,
                          ) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  {/* ================= QUANTITY ================= */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 sm:mt-4">
                    <span className="text-xs font-medium text-gray-600 sm:text-sm">
                      Quantity
                    </span>

                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(
                              1,
                              item.quantity - 1,
                            ),
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="flex h-9 w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.product.stock
                        }
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-4 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ৳
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-gray-900">
                    {shipping === 0
                      ? 'Free'
                      : `৳${shipping}`}
                  </span>
                </div>

                {/* Free Shipping Message */}
                {subtotal < 2000 && (
                  <div className="rounded-lg bg-orange-50 px-3 py-2">
                    <p className="text-xs leading-5 text-orange-600">
                      Add ৳
                      {(
                        2000 - subtotal
                      ).toLocaleString()}{' '}
                      more for free shipping!
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                      ৳
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-xl bg-orange-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 sm:mt-6 sm:py-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="mt-3 block w-full text-center text-xs font-medium text-gray-600 transition hover:text-orange-600 sm:text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CLEAR CART MODAL ================= */}
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
        onCancel={() =>
          setShowClearConfirm(false)
        }
      />
    </main>
  );
}
