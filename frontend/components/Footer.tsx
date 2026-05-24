import Link from 'next/link';
import { Share2, MessageCircle, Camera, Mail, MapPin, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block text-2xl font-bold text-orange-400">🛒 MyKart</Link>
            <p className="mt-3 text-sm text-gray-400">Your favorite online shopping destination in Bangladesh. Quality products, fast delivery, best prices.</p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:scale-110 hover:bg-blue-500"><Share2 className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition hover:scale-110 hover:bg-sky-400"><MessageCircle className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md transition hover:scale-110"><Camera className="h-4 w-4" /></a>
              <a href="mailto:support@mykart.com" aria-label="Email" className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:scale-110 hover:bg-red-400"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-orange-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="inline-block transition hover:translate-x-1 hover:text-orange-400">→ Home</Link></li>
              <li><Link href="/" className="inline-block transition hover:translate-x-1 hover:text-orange-400">→ Products</Link></li>
              <li><Link href="/cart" className="inline-block transition hover:translate-x-1 hover:text-orange-400">→ Cart</Link></li>
              <li><Link href="/orders" className="inline-block transition hover:translate-x-1 hover:text-orange-400">→ My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-orange-400">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400"><MapPin className="h-3 w-3" /></span>
                <span>Dhanmondi, Dhaka 1205</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400"><Phone className="h-3 w-3" /></span>
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400"><Mail className="h-3 w-3" /></span>
                <span>support@mykart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} MyKart. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">Built with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> using Next.js + NestJS + PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}