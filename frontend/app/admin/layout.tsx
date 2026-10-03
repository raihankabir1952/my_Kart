'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  LogOut,
  Crown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, logout } = useAuth();

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop sidebar
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // --------------------------------------------------
  // Auth protection
  // --------------------------------------------------
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  // --------------------------------------------------
  // Close mobile sidebar when route changes
  // --------------------------------------------------
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // --------------------------------------------------
  // Prevent body scrolling when mobile sidebar is open
  // --------------------------------------------------
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    router.push('/');
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Unauthorized
  // --------------------------------------------------
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* =========================================================
          MOBILE TOP BAR
      ========================================================= */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
        {/* Menu button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile title */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
            <Crown className="h-5 w-5" />
          </div>

          <span className="text-base font-bold text-slate-900">
            MY-KART
          </span>
        </div>

        {/* User avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-sm font-bold text-white shadow-md">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
          text-white shadow-2xl
          transition-all duration-300 ease-in-out

          w-64

          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }

          ${
            desktopCollapsed
              ? 'lg:w-[76px]'
              : 'lg:w-64'
          }
        `}
      >
        {/* =======================================================
            LOGO / HEADER
        ======================================================= */}
        <div
          className={`
            flex h-20 shrink-0 items-center border-b border-white/10
            ${
              desktopCollapsed
                ? 'justify-center px-3'
                : 'justify-between px-5'
            }
          `}
        >
          {/* Logo */}
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20">
              <Crown className="h-6 w-6 text-white" />
            </div>

            {!desktopCollapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-white">
                  MY-KART
                </h1>

                <p className="text-xs text-gray-400">
                  Admin Panel
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =======================================================
            DESKTOP COLLAPSE BUTTON
        ======================================================= */}
        <div
          className={`
            hidden shrink-0 border-b border-white/10 p-3 lg:block
            ${desktopCollapsed ? 'text-center' : ''}
          `}
        >
          <button
            type="button"
            onClick={() => setDesktopCollapsed((prev) => !prev)}
            title={
              desktopCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            className={`
              flex h-10 w-full items-center rounded-xl
              text-gray-400 transition
              hover:bg-white/10 hover:text-white
              ${
                desktopCollapsed
                  ? 'justify-center'
                  : 'justify-end px-3'
              }
            `}
          >
            {desktopCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
            IMPORTANT:
            Only this section scrolls.
            User + Logout stays at bottom.
        ======================================================= */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={
                    desktopCollapsed
                      ? item.name
                      : undefined
                  }
                  className={`
                    group flex min-h-12 items-center rounded-xl
                    transition-all duration-200
                    ${
                      desktopCollapsed
                        ? 'justify-center px-2'
                        : 'gap-3 px-3'
                    }

                    ${
                      isActive
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-lg
                      ${
                        isActive
                          ? `bg-gradient-to-br ${item.gradient} shadow-md`
                          : 'bg-white/5 group-hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Label */}
                  {!desktopCollapsed && (
                    <span className="truncate text-sm font-medium">
                      {item.name}
                    </span>
                  )}

                  {/* Active indicator */}
                  {!desktopCollapsed && isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-orange-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =======================================================
            USER + LOGOUT
            FIXED AT BOTTOM
        ======================================================= */}
        <div
          className={`
            shrink-0 border-t border-white/10 bg-slate-900
            ${
              desktopCollapsed
                ? 'p-3'
                : 'p-4'
            }
          `}
        >
          {/* User profile */}
          <div
            className={`
              mb-3 flex items-center rounded-xl bg-white/5
              ${
                desktopCollapsed
                  ? 'justify-center p-2'
                  : 'gap-3 p-3'
              }
            `}
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 font-bold text-white shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* User info */}
            {!desktopCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title={
              desktopCollapsed
                ? 'Logout'
                : undefined
            }
            className={`
              flex min-h-11 w-full items-center rounded-xl
              text-sm font-semibold text-gray-400
              transition-all duration-200
              hover:bg-red-500/10 hover:text-red-400
              ${
                desktopCollapsed
                  ? 'justify-center'
                  : 'gap-3 px-3'
              }
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" />

            {!desktopCollapsed && (
              <span>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main
        className={`
          min-h-screen
          pt-16 transition-all duration-300
          lg:pt-0
          ${
            desktopCollapsed
              ? 'lg:pl-[76px]'
              : 'lg:pl-64'
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}