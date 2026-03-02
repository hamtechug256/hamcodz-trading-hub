'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PositionSize from '@/components/tools/PositionSize';
import PipCalculator from '@/components/tools/PipCalculator';
import RiskReward from '@/components/tools/RiskReward';
import MarginCalc from '@/components/tools/MarginCalc';
import ProfitCalc from '@/components/tools/ProfitCalc';
import Fibonacci from '@/components/tools/Fibonacci';
import PivotPoints from '@/components/tools/PivotPoints';
import TradingJournal from '@/components/tools/TradingJournal';

const TOOLS = [
  { id: 'position', name: 'Position Size', icon: '📐', desc: 'Calculate lot size based on risk' },
  { id: 'pip', name: 'Pip Value', icon: '🔢', desc: 'Value of pip per lot' },
  { id: 'rr', name: 'Risk/Reward', icon: '⚖️', desc: 'Calculate R:R ratio' },
  { id: 'margin', name: 'Margin', icon: '💳', desc: 'Required margin calculator' },
  { id: 'profit', name: 'Profit/Loss', icon: '💰', desc: 'Calculate P/L for trades' },
  { id: 'fib', name: 'Fibonacci', icon: '🌀', desc: 'Retracement & extension levels' },
  { id: 'pivot', name: 'Pivot Points', icon: '🎯', desc: 'Support & resistance levels' },
  { id: 'journal', name: 'Journal', icon: '📔', desc: 'Track your trades' },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState('position');

  const renderTool = () => {
    switch (activeTool) {
      case 'position': return <PositionSize />;
      case 'pip': return <PipCalculator />;
      case 'rr': return <RiskReward />;
      case 'margin': return <MarginCalc />;
      case 'profit': return <ProfitCalc />;
      case 'fib': return <Fibonacci />;
      case 'pivot': return <PivotPoints />;
      case 'journal': return <TradingJournal />;
      default: return <PositionSize />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="neon-green">Trading</span> Tools
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional calculators for position sizing, risk management, and technical analysis.
            All calculations run locally in your browser.
          </p>
        </div>
      </section>

      {/* Tools Navigation */}
      <section className="px-4 mb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTool === tool.id
                    ? 'bg-[rgba(0,255,136,0.2)] border border-[#00ff88] text-[#00ff88]'
                    : 'bg-black/30 border border-gray-700 text-gray-400 hover:border-[#00ff88] hover:text-white'
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="font-medium hidden sm:inline">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Tool */}
      <main className="px-4 pb-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {renderTool()}
        </div>
      </main>

      {/* All Tools Grid */}
      <section className="px-4 py-8 border-t border-[rgba(0,255,136,0.1)] bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">
            <span className="neon-cyan">All Tools</span> at a Glance
          </h3>
          <div className="tools-grid">
            {TOOLS.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`tool-card p-5 cursor-pointer ${activeTool === tool.id ? 'border-[#00ff88]' : ''}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{tool.icon}</span>
                  <h4 className="text-lg font-bold text-white">{tool.name}</h4>
                </div>
                <p className="text-gray-400 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
