import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(0,255,136,0.1)] py-8 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00ffff] flex items-center justify-center font-bold text-black text-sm">
                H
              </div>
              <span className="text-lg font-bold">
                <span className="neon-green">HAMCODZ</span>
                <span className="text-white"> Trading Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Professional trading tools built by a trader, for traders. 100% free, no API keys, no signups required.
            </p>
            <p className="text-gray-500 text-sm">
              <span className="neon-green">HAMCODZ</span> - Developer | Trader | Cybersecurity Expert 🇺🇬
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Kampala, Uganda
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Trading Tools
                </Link>
              </li>
              <li>
                <Link href="/signals" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Signal Hub
                </Link>
              </li>
              <li>
                <Link href="/prices" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Live Prices
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-3">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/hamtechug256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm flex items-center gap-2"
                >
                  <span>📦</span> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/hamcodz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm flex items-center gap-2"
                >
                  <span>🐦</span> @hamcodz
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Hamcodz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm flex items-center gap-2"
                >
                  <span>✈️</span> Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:hamzaholix@gmail.com"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm flex items-center gap-2"
                >
                  <span>📧</span> Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(0,255,136,0.1)] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} HAMCODZ Trading Hub. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <span className="badge badge-green">100% Free</span>
            <span className="badge badge-pink">No API Keys</span>
            <span className="badge badge-cyan">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
