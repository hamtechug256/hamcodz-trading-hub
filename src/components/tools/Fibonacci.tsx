'use client';

import { useState, useMemo } from 'react';
import { calculateFibonacci, FibonacciResult } from '@/lib/calculations';

export default function Fibonacci() {
  const [highPrice, setHighPrice] = useState<string>('1.12000');
  const [lowPrice, setLowPrice] = useState<string>('1.10000');
  const [trend, setTrend] = useState<'uptrend' | 'downtrend'>('uptrend');

  const result = useMemo<FibonacciResult | null>(() => {
    const high = parseFloat(highPrice) || 0;
    const low = parseFloat(lowPrice) || 0;
    
    if (high > 0 && low > 0 && high !== low) {
      return calculateFibonacci({
        highPrice: Math.max(high, low),
        lowPrice: Math.min(high, low),
        trend,
      });
    }
    return null;
  }, [highPrice, lowPrice, trend]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🌀</span>
        <h3 className="text-xl font-bold neon-green">Fibonacci Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate Fibonacci retracement and extension levels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="cyber-label">High Price</label>
          <input
            type="number"
            className="cyber-input"
            value={highPrice}
            onChange={(e) => setHighPrice(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Low Price</label>
          <input
            type="number"
            className="cyber-input"
            value={lowPrice}
            onChange={(e) => setLowPrice(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Trend Direction</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition-all text-sm ${
                trend === 'uptrend'
                  ? 'bg-green-500/30 border border-green-500 text-green-400'
                  : 'bg-black/30 border border-gray-700 text-gray-400'
              }`}
              onClick={() => setTrend('uptrend')}
            >
              UPTREND
            </button>
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition-all text-sm ${
                trend === 'downtrend'
                  ? 'bg-red-500/30 border border-red-500 text-red-400'
                  : 'bg-black/30 border border-gray-700 text-gray-400'
              }`}
              onClick={() => setTrend('downtrend')}
            >
              DOWNTREND
            </button>
          </div>
        </div>
      </div>
      
      {result && (
        <div className="mt-6 fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Retracements */}
          <div className="result-box">
            <h4 className="text-lg font-bold neon-cyan mb-4">Retracement Levels</h4>
            <div className="space-y-2">
              {result.retracements.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">{r.level}</span>
                  <span className={`font-mono font-bold ${
                    r.level === '50%' ? 'neon-green' :
                    r.level === '61.8%' ? 'neon-pink' : 'text-white'
                  }`}>
                    {r.price.toFixed(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Extensions */}
          <div className="result-box">
            <h4 className="text-lg font-bold neon-pink mb-4">Extension Levels</h4>
            <div className="space-y-2">
              {result.extensions.map((e, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">{e.level}</span>
                  <span className="font-mono font-bold text-white">
                    {e.price.toFixed(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
