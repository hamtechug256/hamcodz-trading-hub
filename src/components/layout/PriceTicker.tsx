'use client';

import { useState, useEffect } from 'react';
import { fetchQuickCryptoPrices, CryptoPrice } from '@/lib/crypto-api';
import { fetchQuickForexRates, ForexRate, formatForexRate } from '@/lib/forex-api';

export default function PriceTicker() {
  const [btc, setBtc] = useState<CryptoPrice | null>(null);
  const [eth, setEth] = useState<CryptoPrice | null>(null);
  const [eurusd, setEurusd] = useState<ForexRate | null>(null);
  const [gbpusd, setGbpusd] = useState<ForexRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      
      const [crypto, forex] = await Promise.all([
        fetchQuickCryptoPrices(),
        fetchQuickForexRates()
      ]);
      
      setBtc(crypto.btc);
      setEth(crypto.eth);
      setEurusd(forex.eurusd);
      setGbpusd(forex.gbpusd);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    };

    fetchPrices();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCryptoPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="tool-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold neon-green">Live Prices</h3>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-gray-500">Updating...</span>
          )}
          <span className="text-xs text-gray-500">{lastUpdate}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* BTC */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">₿</span>
            <span className="font-semibold text-white">BTC/USD</span>
          </div>
          {btc ? (
            <>
              <p className="text-xl font-bold text-white">{formatCryptoPrice(btc.price)}</p>
              <p className={`text-sm ${btc.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {btc.change24h >= 0 ? '▲' : '▼'} {Math.abs(btc.change24h).toFixed(2)}%
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>

        {/* ETH */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">Ξ</span>
            <span className="font-semibold text-white">ETH/USD</span>
          </div>
          {eth ? (
            <>
              <p className="text-xl font-bold text-white">{formatCryptoPrice(eth.price)}</p>
              <p className={`text-sm ${eth.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {eth.change24h >= 0 ? '▲' : '▼'} {Math.abs(eth.change24h).toFixed(2)}%
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>

        {/* EUR/USD */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💶</span>
            <span className="font-semibold text-white">EUR/USD</span>
          </div>
          {eurusd ? (
            <>
              <p className="text-xl font-bold text-white">{formatForexRate(eurusd.rate)}</p>
              <p className="text-sm text-gray-400">Forex</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>

        {/* GBP/USD */}
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💷</span>
            <span className="font-semibold text-white">GBP/USD</span>
          </div>
          {gbpusd ? (
            <>
              <p className="text-xl font-bold text-white">{formatForexRate(gbpusd.rate)}</p>
              <p className="text-sm text-gray-400">Forex</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
