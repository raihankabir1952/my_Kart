'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Crown,
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
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 shadow-2xl">
        {/* Logo */}
        <div className="border-b border-white/10 p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
              <Crown className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MyKart</h1>
              <p className="text-xs text-orange-300">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile + Logout */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 font-bold text-white shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">{children}</main>
    </div>
  );
}