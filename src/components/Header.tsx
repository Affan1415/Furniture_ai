'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Shop All', href: '/' },
  { name: 'Place in Room', href: '/place-in-room' },
  { name: 'Chairs', href: '/?category=chair' },
  { name: 'Sofas', href: '/?category=sofa' },
  { name: 'Tables', href: '/?category=table' },
  { name: 'Beds', href: '/?category=bed' },
  { name: 'Lighting', href: '/?category=lamp' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-stone-700 hover:text-stone-900"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className={cn(
                'text-xl lg:text-2xl font-semibold tracking-tight',
                'text-stone-900'
              )}
            >
              FORMA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium text-stone-600',
                    'hover:text-stone-900 transition-colors',
                    'relative after:absolute after:bottom-0 after:left-0',
                    'after:w-0 after:h-px after:bg-stone-900',
                    'hover:after:w-full after:transition-all'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className="hidden sm:block p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50',
                'bg-white shadow-xl lg:hidden'
              )}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-100">
                  <span className="text-xl font-semibold text-stone-900">
                    FORMA
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-stone-600 hover:text-stone-900"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'block px-4 py-3 rounded-lg',
                            'text-base font-medium text-stone-700',
                            'hover:bg-stone-50 hover:text-stone-900',
                            'transition-colors'
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-stone-100">
                  <div className="flex items-center gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors">
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </button>
                    <button className="flex items-center justify-center p-3 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors">
                      <Search className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
