'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BIFA Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/news" className="px-3 py-2 rounded-md hover:bg-gray-100">News</Link>
            <Link href="/teams" className="px-3 py-2 rounded-md hover:bg-gray-100">Teams</Link>
            <Link href="/admin" className="px-3 py-2 rounded-md hover:bg-gray-100">Admin</Link>
            <Link href="/referee" className="px-3 py-2 rounded-md hover:bg-gray-100">Referee</Link>
            <Link href="/secretariat" className="px-3 py-2 rounded-md hover:bg-gray-100">Secretariat</Link>
            <Link href="/public" className="px-3 py-2 rounded-md hover:bg-gray-100">Public</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/news" className="block px-3 py-2 rounded-md hover:bg-gray-100">News</Link>
            <Link href="/teams" className="block px-3 py-2 rounded-md hover:bg-gray-100">Teams</Link>
            <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100">Admin</Link>
            <Link href="/referee" className="block px-3 py-2 rounded-md hover:bg-gray-100">Referee</Link>
            <Link href="/secretariat" className="block px-3 py-2 rounded-md hover:bg-gray-100">Secretariat</Link>
            <Link href="/public" className="block px-3 py-2 rounded-md hover:bg-gray-100">Public</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
