'use client';

import { useState, useMemo } from 'react';
import { calculateProfit, ProfitCalcResult } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD'
];

export default function ProfitCalc() {
  const [entryPrice, setEntryPrice] = useState<string>('1.10000');
  const [exitPrice, setExitPrice] = useState<string>('1.10500');
  const [lotSize, setLotSize] = useState<string>('0.1');
  const [pair, setPair] = useState<string>('EUR/USD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');

  const result = useMemo<ProfitCalcResult | null>(() => {
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const lot = parseFloat(lotSize) || 0;
    
    if (entry > 0 && exit > 0 && lot > 0) {
      return calculateProfit({
        entryPrice: entry,
        exitPrice: exit,
        lotSize: lot,
        pair,
        direction,
      });
    }
    return null;
  }, [entryPrice, exitPrice, lotSize, pair, direction]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💰</span>
        <h3 className="text-xl font-bold neon-green">Profit/Loss Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate the profit or loss for your trade.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="cyber-label">Currency Pair</label>
          <select
            className="cyber-select"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            {PAIRS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="cyber-label">Direction</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                direction === 'buy'
                  ? 'bg-green-500/30 border border-green-500 text-green-400'
                  : 'bg-black/30 border border-gray-700 text-gray-400'
              }`}
              onClick={() => setDirection('buy')}
            >
              BUY
            </button>
            <button
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                direction === 'sell'
                  ? 'bg-red-500/30 border border-red-500 text-red-400'
                  : 'bg-black/30 border border-gray-700 text-gray-400'
              }`}
              onClick={() => setDirection('sell')}
            >
              SELL
            </button>
          </div>
        </div>
        
        <div>
          <label className="cyber-label">Entry Price</label>
          <input
            type="number"
            className="cyber-input"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Exit Price</label>
          <input
            type="number"
            className="cyber-input"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="cyber-label">Lot Size</label>
          <input
            type="number"
            className="cyber-input"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            step="0.01"
          />
        </div>
      </div>
      
      {result && (
        <div className={`result-box mt-6 fade-in ${result.direction === 'loss' ? 'border-red-500 bg-red-500/10' : ''}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Pips</p>
              <p className={`text-xl font-bold ${result.pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.pips >= 0 ? '+' : ''}{result.pips}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Profit/Loss</p>
              <p className={`text-2xl font-bold ${result.direction === 'profit' ? 'neon-green' : 'text-red-400'}`}>
                {result.profit >= 0 ? '+' : ''}${result.profit}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">% Change</p>
              <p className={`text-xl font-bold ${result.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.profitPercent >= 0 ? '+' : ''}{result.profitPercent}%
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className={`badge ${result.direction === 'profit' ? 'badge-green' : 'badge-red'}`}>
              {result.direction === 'profit' ? '✓ Profit' : '✗ Loss'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
