'use client';

import { useState, useEffect } from 'react';
import { getMarketStatus, MarketStatus as MarketStatusType, getSessionColor } from '@/lib/market-hours';

export default function MarketStatus() {
  const [status, setStatus] = useState<MarketStatusType | null>(null);

  useEffect(() => {
    // Initial status
    setStatus(getMarketStatus());
    
    // Update every minute
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <div className="tool-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold neon-cyan">Market Status</h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
          status.isOpen ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
        }`}>
          <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className={`text-sm font-semibold ${status.isOpen ? 'text-green-400' : 'text-red-400'}`}>
            {status.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>

      {/* Current Session */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">Current Session</p>
        <p className="text-xl font-bold" style={{ color: getSessionColor(status.currentSession) }}>
          {status.currentSession}
        </p>
        {status.nextOpenTime && (
          <p className="text-gray-500 text-sm mt-1">{status.nextOpenTime}</p>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Sydney */}
        <div className={`session-card bg-black/30 rounded-lg p-3 border ${
          status.sessions.sydney.isOpen ? 'border-green-500' : 'border-gray-700'
        }`}>
          <p className="font-semibold text-white text-sm">🇦🇺 Sydney</p>
          <p className={`text-xs ${status.sessions.sydney.isOpen ? 'text-green-400' : 'text-gray-500'}`}>
            {status.sessions.sydney.isOpen ? '● Open' : '○ Closed'}
          </p>
          <p className="text-gray-500 text-xs mt-1">{status.sessions.sydney.openTime}</p>
        </div>

        {/* Tokyo */}
        <div className={`session-card bg-black/30 rounded-lg p-3 border ${
          status.sessions.tokyo.isOpen ? 'border-green-500' : 'border-gray-700'
        }`}>
          <p className="font-semibold text-white text-sm">🇯🇵 Tokyo</p>
          <p className={`text-xs ${status.sessions.tokyo.isOpen ? 'text-green-400' : 'text-gray-500'}`}>
            {status.sessions.tokyo.isOpen ? '● Open' : '○ Closed'}
          </p>
          <p className="text-gray-500 text-xs mt-1">{status.sessions.tokyo.openTime}</p>
        </div>

        {/* London */}
        <div className={`session-card bg-black/30 rounded-lg p-3 border ${
          status.sessions.london.isOpen ? 'border-green-500' : 'border-gray-700'
        }`}>
          <p className="font-semibold text-white text-sm">🇬🇧 London</p>
          <p className={`text-xs ${status.sessions.london.isOpen ? 'text-green-400' : 'text-gray-500'}`}>
            {status.sessions.london.isOpen ? '● Open' : '○ Closed'}
          </p>
          <p className="text-gray-500 text-xs mt-1">{status.sessions.london.openTime}</p>
        </div>

        {/* New York */}
        <div className={`session-card bg-black/30 rounded-lg p-3 border ${
          status.sessions.newyork.isOpen ? 'border-green-500' : 'border-gray-700'
        }`}>
          <p className="font-semibold text-white text-sm">🇺🇸 New York</p>
          <p className={`text-xs ${status.sessions.newyork.isOpen ? 'text-green-400' : 'text-gray-500'}`}>
            {status.sessions.newyork.isOpen ? '● Open' : '○ Closed'}
          </p>
          <p className="text-gray-500 text-xs mt-1">{status.sessions.newyork.openTime}</p>
        </div>
      </div>
    </div>
  );
}
