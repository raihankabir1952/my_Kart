'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  LogIn,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Home,
  Package,
  UserCircle,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileMenuOpen(false);

    toast.success('Logged out successfully');
    router.push('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex flex-shrink-0 items-center text-xl font-bold text-orange-600 transition hover:text-orange-700 sm:text-2xl"
        >
          🛒 MyKart
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
          >
            Home
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
          >
            Products
          </Link>
        </nav>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-orange-600 sm:p-2.5"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5 sm:h-5 sm:w-5" />

            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white ring-2 ring-white sm:-right-1 sm:-top-1 sm:text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ================= DESKTOP USER ================= */}
          {user ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() =>
                  setMenuOpen(!menuOpen)
                }
                className="flex max-w-[220px] items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                <UserIcon className="h-4 w-4 flex-shrink-0" />

                <span className="max-w-[140px] truncate">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5">
                  {/* User Info */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-orange-600"
                  >
                    Profile
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/orders"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-orange-600"
                  >
                    My Orders
                  </Link>

                  {/* Admin */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="block px-4 py-2.5 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700 sm:flex"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen,
              )
            }
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 hover:text-orange-600 sm:p-2.5 md:hidden"
            aria-label={
              mobileMenuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {/* Navigation */}
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Home className="h-5 w-5" />
                Home
              </Link>

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                </span>

                {totalItems > 0 && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>

            {/* User Section */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="mb-2 rounded-xl bg-gray-50 px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <UserIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-600"
                  >
                    <UserCircle className="h-5 w-5" />
                    Profile
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-600"
                  >
                    <ClipboardList className="h-5 w-5" />
                    My Orders
                  </Link>

                  {/* Admin */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}