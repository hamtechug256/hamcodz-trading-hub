'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchCryptoPrices, CryptoPrice } from '@/lib/crypto-api';
import { fetchForexRates, ForexRate, formatForexRate } from '@/lib/forex-api';
import { getMarketStatus, MarketStatus, getSessionColor } from '@/lib/market-hours';

export default function PricesPage() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [forexRates, setForexRates] = useState<ForexRate[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [crypto, forex] = await Promise.all([
        fetchCryptoPrices(),
        fetchForexRates()
      ]);
      
      setCryptoPrices(crypto);
      setForexRates(forex);
      setMarketStatus(getMarketStatus());
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to fetch prices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-cyan">Live</span> Prices
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real-time market data from <span className="text-[#00ff88]">CoinGecko</span> and{' '}
              <span className="text-[#00ffff]">ExchangeRate-API</span>. No fake data — all prices are LIVE.
            </p>
          </div>

          {/* Market Status */}
          {marketStatus && (
            <div className={`tool-card p-6 mb-8 ${marketStatus.isOpen ? 'border-green-500/30' : 'border-red-500/30'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`relative w-4 h-4 rounded-full ${marketStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                    {marketStatus.isOpen && (
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      Forex Market: <span className={marketStatus.isOpen ? 'text-green-400' : 'text-red-400'}>
                        {marketStatus.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      {marketStatus.isOpen ? marketStatus.currentSession : marketStatus.nextOpenTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {Object.entries(marketStatus.sessions).map(([name, session]) => (
                    <div key={name} className={`px-3 py-2 rounded-lg text-sm ${session.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                      <span className="capitalize">{name}</span>
                      <span className="text-xs ml-1">{session.isOpen ? '●' : '○'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="tool-card p-4 mb-6 border-red-500/30 bg-red-500/10 text-red-400 text-center">
              {error}
              <button onClick={fetchData} className="ml-4 underline">Retry</button>
            </div>
          )}

          {/* Last Update & Refresh */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              Last updated: {lastUpdate || 'Loading...'}
            </p>
            <button
              onClick={fetchData}
              disabled={loading}
              className="cyber-btn py-2 px-4 text-sm"
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {loading && cryptoPrices.length === 0 ? (
            <div className="tool-card p-12 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-400">Loading live prices...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Crypto Prices */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">₿</span>
                  <span className="neon-green">Crypto Prices</span>
                  <span className="text-xs text-gray-500">(CoinGecko)</span>
                </h2>
                <div className="space-y-3">
                  {cryptoPrices.map((crypto) => (
                    <div key={crypto.id} className="tool-card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00ffff]/20 flex items-center justify-center font-bold text-[#00ff88]">
                          {crypto.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{crypto.symbol}/USD</p>
                          <p className="text-gray-500 text-sm">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white font-mono">
                          ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.change24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.change24h).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forex Rates */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💱</span>
                  <span className="neon-cyan">Forex Rates</span>
                  <span className="text-xs text-gray-500">(ExchangeRate-API)</span>
                </h2>
                <div className="space-y-3">
                  {forexRates.map((rate) => (
                    <div key={rate.pair} className="tool-card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#00ff88]/20 flex items-center justify-center font-bold text-[#00ffff]">
                          {rate.pair.split('/')[0].slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{rate.pair}</p>
                          <p className="text-gray-500 text-sm">Forex</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white font-mono">
                          {formatForexRate(rate.rate)}
                        </p>
                        <p className="text-gray-500 text-sm">{rate.lastUpdate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data Attribution */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg text-center">
            <p className="text-gray-500 text-sm">
              Data provided by{' '}
              <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline">
                CoinGecko
              </a>
              {' '}and{' '}
              <a href="https://open.er-api.com" target="_blank" rel="noopener noreferrer" className="text-[#00ffff] hover:underline">
                ExchangeRate-API
              </a>
              . Prices update automatically every 60 seconds.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Note: Forex rates are indicative. Crypto prices are real-time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
