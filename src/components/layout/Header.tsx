'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/tools', label: 'Tools', icon: '🛠️' },
  { href: '/signals', label: 'Signals', icon: '📡' },
  { href: '/prices', label: 'Live Prices', icon: '💹' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[rgba(0,255,136,0.2)] bg-[rgba(10,10,10,0.95)] backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00ffff] flex items-center justify-center font-bold text-black text-lg">
              H
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="neon-green">HAMCODZ</span>
                <span className="text-white"> Trading Hub</span>
              </h1>
              <p className="text-gray-500 text-xs hidden md:block">Professional Trading Tools</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-1 md:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-[rgba(0,255,136,0.2)] border border-[#00ff88] text-[#00ff88]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden lg:flex gap-3 text-sm">
            <a
              href="https://github.com/hamtechug256"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/hamcodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://t.me/Hamcodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
