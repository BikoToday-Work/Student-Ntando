import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold text-white">BIFA</span>
            </div>
            <p className="text-sm text-gray-400">
              Burundi International Football Association - Managing football excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
              <li><Link href="/referee" className="hover:text-white transition">Referee Portal</Link></li>
              <li><Link href="/secretariat" className="hover:text-white transition">Secretariat</Link></li>
              <li><Link href="/public" className="hover:text-white transition">Public View</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition">Support</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition">
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-gray-400">info@bifa.bi</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BIFA Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
