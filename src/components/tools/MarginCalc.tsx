'use client';

import { useState, useMemo } from 'react';
import { calculateMargin, MarginCalcResult } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'XAU/USD', 'XAG/USD'
];

const LEVERAGES = [10, 20, 50, 100, 200, 500, 1000];

export default function MarginCalc() {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [leverage, setLeverage] = useState<string>('100');
  const [lotSize, setLotSize] = useState<string>('1');
  const [pair, setPair] = useState<string>('EUR/USD');

  const result = useMemo<MarginCalcResult | null>(() => {
    const balance = parseFloat(accountBalance) || 0;
    const lev = parseFloat(leverage) || 100;
    const lot = parseFloat(lotSize) || 0;
    
    if (balance > 0 && lot > 0) {
      return calculateMargin({
        accountBalance: balance,
        leverage: lev,
        lotSize: lot,
        pair,
      });
    }
    return null;
  }, [accountBalance, leverage, lotSize, pair]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💳</span>
        <h3 className="text-xl font-bold neon-green">Margin Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate required margin, free margin, and margin level for your positions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="cyber-label">Account Balance</label>
          <input
            type="number"
            className="cyber-input"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            placeholder="10000"
          />
        </div>
        
        <div>
          <label className="cyber-label">Leverage</label>
          <select
            className="cyber-select"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
          >
            {LEVERAGES.map((l) => (
              <option key={l} value={l}>1:{l}</option>
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
      </div>
      
      {result && (
        <div className="result-box mt-6 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Required Margin</p>
              <p className="text-xl font-bold neon-green">${result.requiredMargin}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Free Margin</p>
              <p className={`text-xl font-bold ${result.freeMargin >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${result.freeMargin}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Margin Level</p>
              <p className={`text-xl font-bold ${result.marginLevel >= 100 ? 'neon-cyan' : 'text-red-400'}`}>
                {result.marginLevel}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Notional Value</p>
              <p className="text-xl font-bold text-white">${result.notionalValue.toLocaleString()}</p>
            </div>
          </div>
          
          {result.marginLevel < 100 && (
            <div className="mt-4 text-center">
              <span className="badge badge-red">⚠️ Low Margin Level</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
