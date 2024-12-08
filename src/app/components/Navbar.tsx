'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              FlowFundr
            </Link>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/owner"
              className={`px-3 py-2 rounded-md ${
                pathname === '/owner'
                  ? 'bg-foreground text-background'
                  : 'hover:bg-gray-100'
              }`}
            >
              Property Owner
            </Link>
            <Link
              href="/investor"
              className={`px-3 py-2 rounded-md ${
                pathname === '/investor'
                  ? 'bg-foreground text-background'
                  : 'hover:bg-gray-100'
              }`}
            >
              Investor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 