// LocalStorage helpers for persistence

const STORAGE_KEYS = {
  JOURNAL: 'hamcodz-journal',
  SIGNALS: 'hamcodz-signals',
  SETTINGS: 'hamcodz-settings'
};

// ==================== TRADING JOURNAL ====================

export interface StoredTrade {
  id: string;
  date: string;
  pair: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exitPrice: number;
  lotSize: number;
  result: number;
  notes: string;
}

export function saveTrades(trades: StoredTrade[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(trades));
  } catch (error) {
    console.error('Failed to save trades:', error);
  }
}

export function loadTrades(): StoredTrade[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load trades:', error);
    return [];
  }
}

// ==================== SIGNALS ====================

export interface StoredSignal {
  id: string;
  createdAt: string;
  pair: string;
  direction: 'buy' | 'sell';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  notes: string;
  status: 'active' | 'hit_tp1' | 'hit_tp2' | 'hit_sl' | 'closed';
  closedAt?: string;
  resultPips?: number;
}

export function saveSignals(signals: StoredSignal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SIGNALS, JSON.stringify(signals));
  } catch (error) {
    console.error('Failed to save signals:', error);
  }
}

export function loadSignals(): StoredSignal[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SIGNALS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load signals:', error);
    return [];
  }
}

// ==================== SETTINGS ====================

export interface AppSettings {
  theme: 'dark' | 'light';
  currency: string;
  leverage: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  currency: 'USD',
  leverage: 100
};

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadSettings();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// ==================== SIGNALS STATS ====================

export interface SignalStats {
  totalSignals: number;
  activeSignals: number;
  closedSignals: number;
  winRate: number;
  totalPips: number;
  wins: number;
  losses: number;
}

export function calculateSignalStats(signals: StoredSignal[]): SignalStats {
  const totalSignals = signals.length;
  const activeSignals = signals.filter(s => s.status === 'active').length;
  const closedSignals = signals.filter(s => s.status !== 'active');
  
  const wins = closedSignals.filter(s => s.status === 'hit_tp1' || s.status === 'hit_tp2').length;
  const losses = closedSignals.filter(s => s.status === 'hit_sl').length;
  
  const winRate = closedSignals.length > 0 
    ? Math.round((wins / closedSignals.length) * 100 * 100) / 100 
    : 0;
  
  const totalPips = closedSignals.reduce((sum, s) => sum + (s.resultPips || 0), 0);
  
  return {
    totalSignals,
    activeSignals,
    closedSignals: closedSignals.length,
    winRate,
    totalPips: Math.round(totalPips * 10) / 10,
    wins,
    losses
  };
}

// Calculate pips when signal is closed
export function calculateSignalPips(
  signal: StoredSignal,
  closePrice: number
): number {
  const pipSize = signal.pair.includes('JPY') ? 0.01 : 0.0001;
  
  if (signal.direction === 'buy') {
    return (closePrice - signal.entry) / pipSize;
  } else {
    return (signal.entry - closePrice) / pipSize;
  }
}
