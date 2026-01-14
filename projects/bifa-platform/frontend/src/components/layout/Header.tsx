'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-xl font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BIFA Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Home</Link>
            <Link href="/public" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Matches</Link>
            <Link href="/public" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Teams</Link>
            <Link href="/public" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">News</Link>
            <div className="ml-4 flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition inline-flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition inline-flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            <Link href="/" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Home</Link>
            <Link href="/public" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Matches</Link>
            <Link href="/public" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Teams</Link>
            <Link href="/public" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">News</Link>
            <div className="pt-2 border-t mt-2 space-y-1">
              <Link href="/login" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">Login</Link>
              <Link href="/register" className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
