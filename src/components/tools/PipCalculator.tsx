'use client';

import { useState, useMemo } from 'react';
import { calculatePipValue, PipCalcResult } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD',
  'BTC/USD', 'ETH/USD'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export default function PipCalculator() {
  const [pair, setPair] = useState<string>('EUR/USD');
  const [lotSize, setLotSize] = useState<string>('1');
  const [accountCurrency, setAccountCurrency] = useState<string>('USD');

  const result = useMemo<PipCalcResult | null>(() => {
    const lot = parseFloat(lotSize) || 0;
    
    if (lot > 0) {
      return calculatePipValue({
        pair,
        lotSize: lot,
        accountCurrency,
      });
    }
    return null;
  }, [pair, lotSize, accountCurrency]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔢</span>
        <h3 className="text-xl font-bold neon-green">Pip Value Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate the value of a single pip for any currency pair and lot size.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="cyber-label">Lot Size</label>
          <input
            type="number"
            className="cyber-input"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            placeholder="1"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="cyber-label">Account Currency</label>
          <select
            className="cyber-select"
            value={accountCurrency}
            onChange={(e) => setAccountCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      
      {result && (
        <div className="result-box mt-6 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Pip Size</p>
              <p className="text-xl font-bold text-white">{result.pipSize}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pip Value</p>
              <p className="text-xl font-bold neon-green">${result.pipValue}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Per Pip</p>
              <p className="text-lg font-bold neon-cyan">{result.pipValueFormatted}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
