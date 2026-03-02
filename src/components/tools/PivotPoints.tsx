'use client';

import { useState, useMemo } from 'react';
import { calculatePivotPoints, PivotResult } from '@/lib/calculations';

export default function PivotPoints() {
  const [high, setHigh] = useState<string>('1.10500');
  const [low, setLow] = useState<string>('1.09500');
  const [close, setClose] = useState<string>('1.10000');

  const result = useMemo<PivotResult | null>(() => {
    const h = parseFloat(high) || 0;
    const l = parseFloat(low) || 0;
    const c = parseFloat(close) || 0;
    
    if (h > 0 && l > 0 && c > 0) {
      return calculatePivotPoints({
        high: h,
        low: l,
        close: c,
      });
    }
    return null;
  }, [high, low, close]);

  return (
    <div className="tool-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎯</span>
        <h3 className="text-xl font-bold neon-green">Pivot Points Calculator</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Calculate classic pivot points and support/resistance levels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="cyber-label">Previous High</label>
          <input
            type="number"
            className="cyber-input"
            value={high}
            onChange={(e) => setHigh(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Previous Low</label>
          <input
            type="number"
            className="cyber-input"
            value={low}
            onChange={(e) => setLow(e.target.value)}
            step="0.00001"
          />
        </div>
        
        <div>
          <label className="cyber-label">Previous Close</label>
          <input
            type="number"
            className="cyber-input"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            step="0.00001"
          />
        </div>
      </div>
      
      {result && (
        <div className="mt-6 fade-in">
          {/* Pivot Point */}
          <div className="result-box mb-6 text-center">
            <p className="text-gray-400 text-sm">Pivot Point (PP)</p>
            <p className="text-3xl font-bold neon-green">{result.pivot.toFixed(5)}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Support Levels */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-lg font-bold text-red-400 mb-4">Support Levels</h4>
              <div className="space-y-2">
                {result.supports.map((s, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 font-semibold">{s.level}</span>
                    <span className="font-mono font-bold text-white">
                      {s.price.toFixed(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resistance Levels */}
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-lg font-bold text-green-400 mb-4">Resistance Levels</h4>
              <div className="space-y-2">
                {result.resistances.map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                    <span className="text-gray-400 font-semibold">{r.level}</span>
                    <span className="font-mono font-bold text-white">
                      {r.price.toFixed(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
