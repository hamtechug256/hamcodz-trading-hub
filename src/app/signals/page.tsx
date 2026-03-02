'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  StoredSignal,
  StoredTrade,
  loadSignals,
  saveSignals,
  calculateSignalStats,
  SignalStats,
  calculateSignalPips
} from '@/lib/storage';

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'NZD/USD',
  'USD/CAD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD', 'XAG/USD',
  'BTC/USD', 'ETH/USD'
];

export default function SignalsPage() {
  const [signals, setSignals] = useState<StoredSignal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state
  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit1, setTakeProfit1] = useState('');
  const [takeProfit2, setTakeProfit2] = useState('');
  const [notes, setNotes] = useState('');

  // Load signals from localStorage
  useEffect(() => {
    const loaded = loadSignals();
    setSignals(loaded);
    setIsLoaded(true);
  }, []);

  // Save signals whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSignals(signals);
    }
  }, [signals, isLoaded]);

  // Calculate real stats from signals
  const stats = useMemo<SignalStats>(() => {
    return calculateSignalStats(signals);
  }, [signals]);

  const addSignal = () => {
    if (!entry || !stopLoss || !takeProfit1) return;

    const newSignal: StoredSignal = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      pair,
      direction,
      entry: parseFloat(entry),
      stopLoss: parseFloat(stopLoss),
      takeProfit1: parseFloat(takeProfit1),
      takeProfit2: takeProfit2 ? parseFloat(takeProfit2) : undefined,
      notes,
      status: 'active'
    };

    setSignals([newSignal, ...signals]);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setPair('EUR/USD');
    setDirection('buy');
    setEntry('');
    setStopLoss('');
    setTakeProfit1('');
    setTakeProfit2('');
    setNotes('');
  };

  const updateSignalStatus = (id: string, status: StoredSignal['status'], closePrice?: number) => {
    setSignals(signals.map(s => {
      if (s.id !== id) return s;
      
      const pips = closePrice ? calculateSignalPips(s, closePrice) : undefined;
      
      return {
        ...s,
        status,
        closedAt: status !== 'active' ? new Date().toISOString() : undefined,
        resultPips: pips
      };
    }));
  };

  const deleteSignal = (id: string) => {
    setSignals(signals.filter(s => s.id !== id));
  };

  const exportSignals = () => {
    const headers = ['Date', 'Pair', 'Direction', 'Entry', 'SL', 'TP1', 'TP2', 'Status', 'Pips', 'Notes'];
    const rows = signals.map(s => [
      new Date(s.createdAt).toLocaleDateString(),
      s.pair,
      s.direction.toUpperCase(),
      s.entry,
      s.stopLoss,
      s.takeProfit1,
      s.takeProfit2 || '',
      s.status.toUpperCase(),
      s.resultPips?.toFixed(1) || '',
      s.notes
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamcodz-signals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'hit_tp1':
      case 'hit_tp2': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'hit_sl': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDirectionColor = (dir: string) => {
    return dir === 'buy'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-pink">Signal</span> Hub
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track your trading signals with REAL performance statistics.
              All stats are calculated from YOUR signals — no fake data.
            </p>
          </div>

          {/* Real Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
            <div className="tool-card p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.totalSignals}</p>
              <p className="text-gray-400 text-xs">Total Signals</p>
            </div>
            <div className="tool-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.activeSignals}</p>
              <p className="text-gray-400 text-xs">Active</p>
            </div>
            <div className="tool-card p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.closedSignals}</p>
              <p className="text-gray-400 text-xs">Closed</p>
            </div>
            <div className="tool-card p-4 text-center">
              <p className={`text-2xl font-bold ${stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.winRate}%
              </p>
              <p className="text-gray-400 text-xs">Win Rate</p>
            </div>
            <div className="tool-card p-4 text-center">
              <p className={`text-2xl font-bold ${stats.totalPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalPips >= 0 ? '+' : ''}{stats.totalPips}
              </p>
              <p className="text-gray-400 text-xs">Total Pips</p>
            </div>
            <div className="tool-card p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.wins}W / {stats.losses}L</p>
              <p className="text-gray-400 text-xs">W/L Record</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button onClick={() => setShowForm(!showForm)} className="cyber-btn">
              {showForm ? '✕ Close' : '+ New Signal'}
            </button>
            {signals.length > 0 && (
              <button onClick={exportSignals} className="cyber-btn cyber-btn-pink">
                📥 Export CSV
              </button>
            )}
          </div>

          {/* Add Signal Form */}
          {showForm && (
            <div className="tool-card p-6 mb-8 fade-in">
              <h3 className="text-lg font-bold mb-4">Post New Signal</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="cyber-label">Pair</label>
                  <select className="cyber-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                    {PAIRS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="cyber-label">Direction</label>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-3 rounded-lg text-sm ${direction === 'buy' ? 'bg-green-500/30 text-green-400 border border-green-500' : 'bg-black/30 border border-gray-700'}`}
                      onClick={() => setDirection('buy')}
                    >
                      BUY
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg text-sm ${direction === 'sell' ? 'bg-red-500/30 text-red-400 border border-red-500' : 'bg-black/30 border border-gray-700'}`}
                      onClick={() => setDirection('sell')}
                    >
                      SELL
                    </button>
                  </div>
                </div>
                <div>
                  <label className="cyber-label">Entry Price</label>
                  <input type="number" className="cyber-input" value={entry} onChange={(e) => setEntry(e.target.value)} step="0.00001" placeholder="1.0850" />
                </div>
                <div>
                  <label className="cyber-label">Stop Loss</label>
                  <input type="number" className="cyber-input" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} step="0.00001" placeholder="1.0800" />
                </div>
                <div>
                  <label className="cyber-label">Take Profit 1</label>
                  <input type="number" className="cyber-input" value={takeProfit1} onChange={(e) => setTakeProfit1(e.target.value)} step="0.00001" placeholder="1.0900" />
                </div>
                <div>
                  <label className="cyber-label">Take Profit 2 (Optional)</label>
                  <input type="number" className="cyber-input" value={takeProfit2} onChange={(e) => setTakeProfit2(e.target.value)} step="0.00001" placeholder="1.0950" />
                </div>
                <div className="md:col-span-2">
                  <label className="cyber-label">Analysis Notes</label>
                  <input type="text" className="cyber-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter your analysis..." />
                </div>
              </div>
              <button onClick={addSignal} className="cyber-btn w-full mt-4 py-4">
                ✓ Post Signal
              </button>
            </div>
          )}

          {/* Signals List */}
          {signals.length > 0 ? (
            <div className="space-y-4">
              {signals.map((signal) => (
                <div key={signal.id} className="tool-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${signal.direction === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {signal.direction === 'buy' ? '📈' : '📉'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-lg">{signal.pair}</span>
                          <span className={`px-2 py-1 rounded text-xs border ${getDirectionColor(signal.direction)}`}>
                            {signal.direction.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(signal.status)}`}>
                            {signal.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-400">
                            Entry: <span className="text-white font-mono">{signal.entry}</span>
                          </span>
                          <span className="text-gray-400">
                            SL: <span className="text-red-400 font-mono">{signal.stopLoss}</span>
                          </span>
                          <span className="text-gray-400">
                            TP1: <span className="text-green-400 font-mono">{signal.takeProfit1}</span>
                          </span>
                          {signal.takeProfit2 && (
                            <span className="text-gray-400">
                              TP2: <span className="text-green-400 font-mono">{signal.takeProfit2}</span>
                            </span>
                          )}
                        </div>
                        {signal.notes && (
                          <p className="text-gray-500 text-sm mt-2">{signal.notes}</p>
                        )}
                        <p className="text-gray-600 text-xs mt-2">
                          {new Date(signal.createdAt).toLocaleString()}
                          {signal.resultPips !== undefined && (
                            <span className={`ml-3 font-bold ${signal.resultPips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {signal.resultPips >= 0 ? '+' : ''}{signal.resultPips.toFixed(1)} pips
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {signal.status === 'active' && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateSignalStatus(signal.id, 'hit_tp1', signal.takeProfit1)}
                          className="px-3 py-2 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          Hit TP1
                        </button>
                        {signal.takeProfit2 && (
                          <button
                            onClick={() => updateSignalStatus(signal.id, 'hit_tp2', signal.takeProfit2)}
                            className="px-3 py-2 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            Hit TP2
                          </button>
                        )}
                        <button
                          onClick={() => updateSignalStatus(signal.id, 'hit_sl', signal.stopLoss)}
                          className="px-3 py-2 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          Hit SL
                        </button>
                        <button
                          onClick={() => {
                            const price = prompt('Enter close price:');
                            if (price) updateSignalStatus(signal.id, 'closed', parseFloat(price));
                          }}
                          className="px-3 py-2 rounded text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                        >
                          Close
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => deleteSignal(signal.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tool-card p-12 text-center">
              <div className="text-5xl mb-4">📡</div>
              <p className="text-gray-400 text-lg">No signals posted yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Click &quot;New Signal&quot; to post your first trading signal.
                Stats will be calculated from YOUR real signals.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
