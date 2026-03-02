'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trade, JournalStats, calculateJournalStats } from '@/lib/calculations';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD',
  'BTC/USD', 'ETH/USD'
];

const STORAGE_KEY = 'hamcodz-journal';

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [lotSize, setLotSize] = useState('0.1');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');

  // Load trades from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTrades(parsed);
      } catch (e) {
        console.error('Failed to load trades:', e);
      }
    }
  }, []);

  // Save to localStorage when trades change
  useEffect(() => {
    if (trades.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    }
  }, [trades]);

  // Calculate stats
  const stats = useMemo<JournalStats>(() => calculateJournalStats(trades), [trades]);

  const addTrade = () => {
    if (!entryPrice || !exitPrice || !result) return;
    
    const now = new Date();
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      date: now.toISOString(),
      pair,
      direction,
      entryPrice: parseFloat(entryPrice),
      stopLoss: parseFloat(stopLoss) || 0,
      takeProfit: parseFloat(takeProfit) || 0,
      exitPrice: parseFloat(exitPrice),
      lotSize: parseFloat(lotSize),
      result: parseFloat(result),
      notes,
    };
    
    setTrades([newTrade, ...trades]);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setPair('EUR/USD');
    setDirection('buy');
    setEntryPrice('');
    setStopLoss('');
    setTakeProfit('');
    setExitPrice('');
    setLotSize('0.1');
    setResult('');
    setNotes('');
  };

  const deleteTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const exportCSV = () => {
    const headers = ['Date', 'Pair', 'Direction', 'Entry', 'Stop Loss', 'Take Profit', 'Exit', 'Lot Size', 'Result ($)', 'Notes'];
    const rows = trades.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.pair,
      t.direction,
      t.entryPrice,
      t.stopLoss,
      t.takeProfit,
      t.exitPrice,
      t.lotSize,
      t.result,
      `"${t.notes}"`,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamcodz-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all trades? This cannot be undone.')) {
      setTrades([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="tool-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📔</span>
          <h3 className="text-xl font-bold neon-green">Trading Journal</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowForm(!showForm)} className="cyber-btn text-sm py-2 px-4">
            {showForm ? '✕ Close' : '+ Add Trade'}
          </button>
          {trades.length > 0 && (
            <>
              <button onClick={exportCSV} className="cyber-btn cyber-btn-pink text-sm py-2 px-4">
                📥 Export CSV
              </button>
              <button onClick={clearAll} className="text-red-400 text-sm py-2 px-4 hover:text-red-300 border border-red-400/30 rounded-lg">
                🗑️ Clear All
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Stats */}
      {trades.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <p className="text-gray-400 text-xs">Total Trades</p>
            <p className="text-xl font-bold text-white">{stats.totalTrades}</p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <p className="text-gray-400 text-xs">Win Rate</p>
            <p className={`text-xl font-bold ${stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.winRate}%
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <p className="text-gray-400 text-xs">Total P/L</p>
            <p className={`text-xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.totalPnL}
            </p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <p className="text-gray-400 text-xs">Avg Win</p>
            <p className="text-xl font-bold text-green-400">${stats.avgWin}</p>
          </div>
          <div className="bg-black/30 p-3 rounded-lg text-center">
            <p className="text-gray-400 text-xs">Profit Factor</p>
            <p className={`text-xl font-bold ${stats.profitFactor >= 1 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.profitFactor === Infinity ? '∞' : stats.profitFactor}
            </p>
          </div>
        </div>
      )}
      
      {/* Add Trade Form */}
      {showForm && (
        <div className="bg-black/30 p-4 rounded-lg mb-6 fade-in">
          <h4 className="text-lg font-bold mb-4">Add New Trade</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="cyber-label">Pair</label>
              <select className="cyber-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                {PAIRS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="cyber-label">Direction</label>
              <div className="flex gap-1">
                <button
                  className={`flex-1 py-2 rounded text-sm ${direction === 'buy' ? 'bg-green-500/30 text-green-400' : 'bg-black/30 text-gray-400'}`}
                  onClick={() => setDirection('buy')}
                >
                  BUY
                </button>
                <button
                  className={`flex-1 py-2 rounded text-sm ${direction === 'sell' ? 'bg-red-500/30 text-red-400' : 'bg-black/30 text-gray-400'}`}
                  onClick={() => setDirection('sell')}
                >
                  SELL
                </button>
              </div>
            </div>
            <div>
              <label className="cyber-label">Entry Price</label>
              <input type="number" className="cyber-input" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} step="0.00001" placeholder="1.10000" />
            </div>
            <div>
              <label className="cyber-label">Exit Price</label>
              <input type="number" className="cyber-input" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} step="0.00001" placeholder="1.10500" />
            </div>
            <div>
              <label className="cyber-label">Stop Loss</label>
              <input type="number" className="cyber-input" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} step="0.00001" placeholder="1.09500" />
            </div>
            <div>
              <label className="cyber-label">Take Profit</label>
              <input type="number" className="cyber-input" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} step="0.00001" placeholder="1.11000" />
            </div>
            <div>
              <label className="cyber-label">Lot Size</label>
              <input type="number" className="cyber-input" value={lotSize} onChange={(e) => setLotSize(e.target.value)} step="0.01" placeholder="0.1" />
            </div>
            <div>
              <label className="cyber-label">Result ($)</label>
              <input type="number" className="cyber-input" value={result} onChange={(e) => setResult(e.target.value)} step="0.01" placeholder="100" />
            </div>
            <div className="md:col-span-3">
              <label className="cyber-label">Notes</label>
              <input type="text" className="cyber-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Trade notes..." />
            </div>
            <div className="flex items-end">
              <button onClick={addTrade} className="cyber-btn w-full py-3">
                ✓ Save Trade
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Trades List */}
      {trades.length > 0 ? (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="cyber-table">
            <thead className="sticky top-0 bg-[#1a1a2e]">
              <tr>
                <th>Date</th>
                <th>Pair</th>
                <th>Dir</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Lot</th>
                <th>P/L</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id}>
                  <td className="text-gray-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="font-semibold">{t.pair}</td>
                  <td>
                    <span className={`badge ${t.direction === 'buy' ? 'badge-green' : 'badge-red'}`}>
                      {t.direction.toUpperCase()}
                    </span>
                  </td>
                  <td>{t.entryPrice}</td>
                  <td>{t.exitPrice}</td>
                  <td>{t.lotSize}</td>
                  <td className={`font-bold ${t.result >= 0 ? 'profit' : 'loss'}`}>
                    {t.result >= 0 ? '+' : ''}{t.result}
                  </td>
                  <td>
                    <button onClick={() => deleteTrade(t.id)} className="text-red-400 hover:text-red-300">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📊</p>
          <p>No trades recorded yet.</p>
          <p className="text-sm mt-2">Click &quot;Add Trade&quot; to start tracking your trades!</p>
        </div>
      )}
    </div>
  );
}
