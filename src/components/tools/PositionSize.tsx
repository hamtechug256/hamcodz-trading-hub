'use client';

import { useState, useMemo } from 'react';
import { calculatePositionSize, PositionSizeResult } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD',
  'BTC/USD', 'ETH/USD'
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'UGX'];

export default function PositionSize() {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1');
  const [stopLossPips, setStopLossPips] = useState<string>('50');
  const [pair, setPair] = useState<string>('EUR/USD');
  const [accountCurrency, setAccountCurrency] = useState<string>('USD');

  const result = useMemo<PositionSizeResult | null>(() => {
    const balance = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const sl = parseFloat(stopLossPips) || 0;
    
    if (balance > 0 && risk > 0 && sl > 0) {
      return calculatePositionSize({
        accountBalance: balance,
        riskPercent: risk,
        stopLossPips: sl,
        pair,
        accountCurrency,
      });
    }
    return null;
  }, [accountBalance, riskPercent, stopLossPips, pair, accountCurrency]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">📐</span>
        <h3 className="text-xl font-bold neon-green">Position Size Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate the correct lot size based on your risk management rules.
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
          <label className="cyber-label">Risk Percentage (%)</label>
          <input
            type="number"
            className="cyber-input"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            placeholder="1"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="cyber-label">Stop Loss (Pips)</label>
          <input
            type="number"
            className="cyber-input"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(e.target.value)}
            placeholder="50"
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
        
        <div className="md:col-span-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Risk Amount</p>
              <p className="text-xl font-bold text-white">${result.riskAmount}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Pip Value</p>
              <p className="text-xl font-bold text-white">${result.pipValue}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Lot Size</p>
              <p className="text-xl font-bold neon-green">{result.lotSize}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Position</p>
              <p className="text-lg font-bold neon-cyan">{result.positionSize}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
