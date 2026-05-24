import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 font-medium text-white hover:bg-orange-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            <Search className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}