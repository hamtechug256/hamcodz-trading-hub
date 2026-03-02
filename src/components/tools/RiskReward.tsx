'use client';

import { useState, useMemo } from 'react';
import { calculateRiskReward, RiskRewardResult } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD'
];

export default function RiskReward() {
  const [entryPrice, setEntryPrice] = useState<string>('1.10000');
  const [stopLoss, setStopLoss] = useState<string>('1.09500');
  const [takeProfit, setTakeProfit] = useState<string>('1.11000');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [lotSize, setLotSize] = useState<string>('0.1');
  const [pair, setPair] = useState<string>('EUR/USD');

  const result = useMemo<RiskRewardResult | null>(() => {
    const entry = parseFloat(entryPrice) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const tp = parseFloat(takeProfit) || 0;
    const lot = parseFloat(lotSize) || 0;
    
    if (entry > 0 && sl > 0 && tp > 0 && lot > 0) {
      return calculateRiskReward({
        entryPrice: entry,
        stopLoss: sl,
        takeProfit: tp,
        direction,
        lotSize: lot,
        pair,
      });
    }
    return null;
  }, [entryPrice, stopLoss, takeProfit, direction, lotSize, pair]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">⚖️</span>
        <h3 className="text-xl font-bold neon-green">Risk/Reward Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate the risk-to-reward ratio for your trades.
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
          <label className="cyber-label">Lot Size</label>
          <input
            type="number"
            className="cyber-input"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            step="0.01"
          />
        </div>
        
        <div>
          <label className="cyber-label">Stop Loss</label>
          <input
            type="number"
            className="cyber-input"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Take Profit</label>
          <input
            type="number"
            className="cyber-input"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            step="0.00001"
          />
        </div>
      </div>
      
      {result && (
        <div className="result-box mt-6 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Risk Pips</p>
              <p className="text-xl font-bold text-red-400">{result.riskPips}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reward Pips</p>
              <p className="text-xl font-bold text-green-400">{result.rewardPips}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">R:R Ratio</p>
              <p className="text-xl font-bold neon-cyan">{result.riskRewardRatio}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Risk Amount</p>
              <p className="text-xl font-bold text-red-400">${result.riskAmount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reward Amount</p>
              <p className="text-xl font-bold text-green-400">${result.rewardAmount}</p>
            </div>
          </div>
          
          {result.rrRatio >= 2 && (
            <div className="mt-4 text-center">
              <span className="badge badge-green">✓ Good R:R Ratio (1:{result.rrRatio})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
