'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PriceTicker from '@/components/layout/PriceTicker';
import MarketStatus from '@/components/layout/MarketStatus';

const FEATURES = [
  {
    icon: '📐',
    title: 'Position Sizing',
    description: 'Calculate optimal lot sizes based on your risk tolerance',
    href: '/tools'
  },
  {
    icon: '⚖️',
    title: 'Risk Management',
    description: 'Risk/Reward ratios, margin calculations, and pip values',
    href: '/tools'
  },
  {
    icon: '🌀',
    title: 'Technical Analysis',
    description: 'Fibonacci retracements, pivot points, and key levels',
    href: '/tools'
  },
  {
    icon: '📡',
    title: 'Signal Tracking',
    description: 'Post and track your trading signals with performance stats',
    href: '/signals'
  },
  {
    icon: '💹',
    title: 'Live Prices',
    description: 'Real-time crypto and forex prices from free APIs',
    href: '/prices'
  },
  {
    icon: '📔',
    title: 'Trading Journal',
    description: 'Track all your trades and analyze your performance',
    href: '/tools'
  }
];

const STATS = [
  { label: 'Trading Tools', value: '8+' },
  { label: 'Data Sources', value: 'FREE' },
  { label: 'API Keys', value: 'None' },
  { label: 'Cost', value: '$0' }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,255,136,0.1)] border border-[#00ff88] mb-6">
            <span className="text-sm">🇺🇬 Built in Uganda</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-[#00ff88]">100% FREE</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 hero-glow">
            <span className="neon-green">HAMCODZ</span>
            <br />
            <span className="text-white">Trading Hub</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Professional trading tools for serious traders. Position sizing, risk management,
            signal tracking, and live market data — all <span className="neon-cyan">100% free</span> with
            <span className="neon-pink"> no API keys</span> required.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/tools" className="cyber-btn text-lg px-8 py-4">
              🛠️ Open Tools
            </Link>
            <Link href="/signals" className="cyber-btn cyber-btn-pink text-lg px-8 py-4">
              📡 Signal Hub
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="badge badge-green">No Signup</span>
            <span className="badge badge-pink">No API Keys</span>
            <span className="badge badge-cyan">Works Offline</span>
            <span className="badge badge-green">Mobile Friendly</span>
          </div>
        </div>
      </section>

      {/* Live Data Section */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceTicker />
          <MarketStatus />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 py-6 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl md:text-3xl font-bold neon-green">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="neon-cyan">Everything</span> You Need to Trade
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="tool-card p-6 card-hover group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why HAMCODZ */}
      <section className="px-4 py-12 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why <span className="neon-green">HAMCODZ</span> Trading Hub?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00ffff]/20 flex items-center justify-center text-3xl">
                💚
              </div>
              <h3 className="text-lg font-bold mb-2">100% Free Forever</h3>
              <p className="text-gray-400 text-sm">
                No subscriptions, no hidden fees, no premium tiers. All features are completely free.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ff00ff]/20 to-[#00ffff]/20 flex items-center justify-center text-3xl">
                🔒
              </div>
              <h3 className="text-lg font-bold mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">
                Your data stays in your browser using localStorage. We don&apos;t track or store anything.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#00ff88]/20 flex items-center justify-center text-3xl">
                🌍
              </div>
              <h3 className="text-lg font-bold mb-2">Real Data</h3>
              <p className="text-gray-400 text-sm">
                Live prices from CoinGecko and ExchangeRate-API. No fake data, no random numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to <span className="neon-green">Trade Smarter</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Start using professional trading tools today. No signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools" className="cyber-btn px-8 py-4">
              🚀 Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-12 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="tool-card p-6 md:p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00ffff] flex items-center justify-center text-3xl font-bold text-black">
              H
            </div>
            <h3 className="text-2xl font-bold mb-2">
              <span className="neon-green">HAMCODZ</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Developer | Trader | Cybersecurity Expert
            </p>
            <p className="text-gray-500 text-sm mb-4">
              🇺🇬 Kampala, Uganda
            </p>
            <div className="flex justify-center gap-4">
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
              <a
                href="mailto:hamzaholix@gmail.com"
                className="text-gray-400 hover:text-[#00ff88] transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
