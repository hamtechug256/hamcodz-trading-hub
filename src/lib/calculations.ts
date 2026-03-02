// Trading Calculations Library - All pure functions, no external dependencies

// ==================== POSITION SIZE CALCULATOR ====================

export interface PositionSizeInput {
  accountBalance: number;
  riskPercent: number;
  stopLossPips: number;
  pair: string;
  accountCurrency: string;
}

export interface PositionSizeResult {
  riskAmount: number;
  pipValue: number;
  lotSize: number;
  positionSize: string;
}

export function calculatePositionSize(input: PositionSizeInput): PositionSizeResult {
  const { accountBalance, riskPercent, stopLossPips, pair } = input;
  
  const riskAmount = (accountBalance * riskPercent) / 100;
  const pipValuePerLot = getPipValuePerLot(pair);
  const lotSize = riskAmount / (stopLossPips * pipValuePerLot);
  
  let positionSize = '';
  if (lotSize >= 1) {
    positionSize = `${lotSize.toFixed(2)} Standard Lots`;
  } else if (lotSize >= 0.1) {
    positionSize = `${(lotSize * 10).toFixed(2)} Mini Lots`;
  } else {
    positionSize = `${(lotSize * 100).toFixed(2)} Micro Lots`;
  }
  
  return {
    riskAmount: Math.round(riskAmount * 100) / 100,
    pipValue: Math.round(pipValuePerLot * 100) / 100,
    lotSize: Math.round(lotSize * 10000) / 10000,
    positionSize,
  };
}

function getPipValuePerLot(pair: string): number {
  const pairUpper = pair.toUpperCase();
  
  if (pairUpper.includes('JPY')) {
    return 9.15;
  } else if (pairUpper.includes('XAU')) {
    return 10;
  } else if (pairUpper.includes('XAG')) {
    return 5;
  } else if (pairUpper.endsWith('/USD') || pairUpper === 'BTC/USD' || pairUpper === 'ETH/USD') {
    return 10;
  } else {
    return 10;
  }
}

export function getPipSize(pair: string): number {
  const pairUpper = pair.toUpperCase();
  if (pairUpper.includes('JPY')) return 0.01;
  if (pairUpper.includes('XAU')) return 0.01;
  if (pairUpper.includes('XAG')) return 0.001;
  return 0.0001;
}

// ==================== PIP CALCULATOR ====================

export interface PipCalcInput {
  pair: string;
  lotSize: number;
  accountCurrency: string;
}

export interface PipCalcResult {
  pipSize: number;
  pipValue: number;
  pipValueFormatted: string;
}

export function calculatePipValue(input: PipCalcInput): PipCalcResult {
  const { pair, lotSize } = input;
  
  const pairUpper = pair.toUpperCase();
  let pipSize = 0.0001;
  let pipValue = 10;
  
  if (pairUpper.includes('JPY')) {
    pipSize = 0.01;
    pipValue = 9.15;
  } else if (pairUpper.includes('XAU')) {
    pipSize = 0.01;
    pipValue = 10;
  } else if (pairUpper.includes('XAG')) {
    pipSize = 0.001;
    pipValue = 5;
  }
  
  pipValue = pipValue * lotSize;
  
  return {
    pipSize,
    pipValue: Math.round(pipValue * 100) / 100,
    pipValueFormatted: `$${(Math.round(pipValue * 100) / 100).toFixed(2)} per pip`,
  };
}

// ==================== RISK/REWARD CALCULATOR ====================

export interface RiskRewardInput {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  direction: 'buy' | 'sell';
  lotSize: number;
  pair: string;
}

export interface RiskRewardResult {
  riskPips: number;
  rewardPips: number;
  riskRewardRatio: string;
  rrRatio: number;
  riskAmount: number;
  rewardAmount: number;
  riskPercent: number;
  rewardPercent: number;
}

export function calculateRiskReward(input: RiskRewardInput): RiskRewardResult {
  const { entryPrice, stopLoss, takeProfit, direction, lotSize, pair } = input;
  
  let riskPips: number, rewardPips: number;
  
  if (direction === 'buy') {
    riskPips = Math.abs(entryPrice - stopLoss) / getPipSize(pair);
    rewardPips = Math.abs(takeProfit - entryPrice) / getPipSize(pair);
  } else {
    riskPips = Math.abs(stopLoss - entryPrice) / getPipSize(pair);
    rewardPips = Math.abs(entryPrice - takeProfit) / getPipSize(pair);
  }
  
  const pipValue = getPipValuePerLot(pair);
  const riskAmount = riskPips * pipValue * lotSize;
  const rewardAmount = rewardPips * pipValue * lotSize;
  
  const rrRatio = rewardPips / riskPips;
  
  return {
    riskPips: Math.round(riskPips * 10) / 10,
    rewardPips: Math.round(rewardPips * 10) / 10,
    riskRewardRatio: `1:${rrRatio.toFixed(2)}`,
    rrRatio: Math.round(rrRatio * 100) / 100,
    riskAmount: Math.round(riskAmount * 100) / 100,
    rewardAmount: Math.round(rewardAmount * 100) / 100,
    riskPercent: Math.round((riskPips / (entryPrice / getPipSize(pair))) * 10000) / 100,
    rewardPercent: Math.round((rewardPips / (entryPrice / getPipSize(pair))) * 10000) / 100,
  };
}

// ==================== MARGIN CALCULATOR ====================

export interface MarginCalcInput {
  accountBalance: number;
  leverage: number;
  lotSize: number;
  pair: string;
}

export interface MarginCalcResult {
  requiredMargin: number;
  freeMargin: number;
  marginLevel: number;
  notionalValue: number;
}

export function calculateMargin(input: MarginCalcInput): MarginCalcResult {
  const { accountBalance, leverage, lotSize } = input;
  
  const notionalValue = lotSize * 100000;
  
  const requiredMargin = notionalValue / leverage;
  const freeMargin = accountBalance - requiredMargin;
  const marginLevel = (accountBalance / requiredMargin) * 100;
  
  return {
    requiredMargin: Math.round(requiredMargin * 100) / 100,
    freeMargin: Math.round(freeMargin * 100) / 100,
    marginLevel: Math.round(marginLevel * 100) / 100,
    notionalValue: Math.round(notionalValue * 100) / 100,
  };
}

// ==================== PROFIT CALCULATOR ====================

export interface ProfitCalcInput {
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pair: string;
  direction: 'buy' | 'sell';
}

export interface ProfitCalcResult {
  pips: number;
  profit: number;
  profitPercent: number;
  direction: 'profit' | 'loss';
}

export function calculateProfit(input: ProfitCalcInput): ProfitCalcResult {
  const { entryPrice, exitPrice, lotSize, pair, direction } = input;
  
  const pipSize = getPipSize(pair);
  let pips: number;
  
  if (direction === 'buy') {
    pips = (exitPrice - entryPrice) / pipSize;
  } else {
    pips = (entryPrice - exitPrice) / pipSize;
  }
  
  const pipValue = getPipValuePerLot(pair);
  const profit = pips * pipValue * lotSize;
  
  return {
    pips: Math.round(pips * 10) / 10,
    profit: Math.round(profit * 100) / 100,
    profitPercent: Math.round((profit / (lotSize * 1000)) * 100 * 100) / 100,
    direction: profit >= 0 ? 'profit' : 'loss',
  };
}

// ==================== FIBONACCI CALCULATOR ====================

export interface FibonacciInput {
  highPrice: number;
  lowPrice: number;
  trend: 'uptrend' | 'downtrend';
}

export interface FibonacciResult {
  retracements: { level: string; price: number }[];
  extensions: { level: string; price: number }[];
}

export function calculateFibonacci(input: FibonacciInput): FibonacciResult {
  const { highPrice, lowPrice, trend } = input;
  const range = highPrice - lowPrice;
  
  const retracementLevels = [0, 23.6, 38.2, 50, 61.8, 78.6, 100];
  const extensionLevels = [127.2, 161.8, 200, 261.8];
  
  let retracements: { level: string; price: number }[];
  let extensions: { level: string; price: number }[];
  
  if (trend === 'uptrend') {
    retracements = retracementLevels.map(level => ({
      level: `${level}%`,
      price: highPrice - (range * level / 100),
    }));
    extensions = extensionLevels.map(level => ({
      level: `${level}%`,
      price: highPrice + (range * (level - 100) / 100),
    }));
  } else {
    retracements = retracementLevels.map(level => ({
      level: `${level}%`,
      price: lowPrice + (range * level / 100),
    }));
    extensions = extensionLevels.map(level => ({
      level: `${level}%`,
      price: lowPrice - (range * (level - 100) / 100),
    }));
  }
  
  return {
    retracements: retracements.map(r => ({ ...r, price: Math.round(r.price * 100000) / 100000 })),
    extensions: extensions.map(e => ({ ...e, price: Math.round(e.price * 100000) / 100000 })),
  };
}

// ==================== PIVOT POINTS CALCULATOR ====================

export interface PivotInput {
  high: number;
  low: number;
  close: number;
}

export interface PivotResult {
  pivot: number;
  supports: { level: string; price: number }[];
  resistances: { level: string; price: number }[];
}

export function calculatePivotPoints(input: PivotInput): PivotResult {
  const { high, low, close } = input;
  
  const pivot = (high + low + close) / 3;
  
  const s1 = (2 * pivot) - high;
  const s2 = pivot - (high - low);
  const s3 = low - (2 * (high - pivot));
  
  const r1 = (2 * pivot) - low;
  const r2 = pivot + (high - low);
  const r3 = high + (2 * (pivot - low));
  
  return {
    pivot: Math.round(pivot * 100000) / 100000,
    supports: [
      { level: 'S1', price: Math.round(s1 * 100000) / 100000 },
      { level: 'S2', price: Math.round(s2 * 100000) / 100000 },
      { level: 'S3', price: Math.round(s3 * 100000) / 100000 },
    ],
    resistances: [
      { level: 'R1', price: Math.round(r1 * 100000) / 100000 },
      { level: 'R2', price: Math.round(r2 * 100000) / 100000 },
      { level: 'R3', price: Math.round(r3 * 100000) / 100000 },
    ],
  };
}

// ==================== TRADING JOURNAL TYPES ====================

export interface Trade {
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

export interface JournalStats {
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  bestTrade: number;
  worstTrade: number;
}

export function calculateJournalStats(trades: Trade[]): JournalStats {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      winRate: 0,
      totalPnL: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      bestTrade: 0,
      worstTrade: 0,
    };
  }
  
  const winTrades = trades.filter(t => t.result > 0);
  const lossTrades = trades.filter(t => t.result < 0);
  
  const totalWins = winTrades.reduce((sum, t) => sum + t.result, 0);
  const totalLosses = Math.abs(lossTrades.reduce((sum, t) => sum + t.result, 0));
  
  return {
    totalTrades: trades.length,
    winTrades: winTrades.length,
    lossTrades: lossTrades.length,
    winRate: Math.round((winTrades.length / trades.length) * 100 * 100) / 100,
    totalPnL: Math.round(trades.reduce((sum, t) => sum + t.result, 0) * 100) / 100,
    avgWin: winTrades.length > 0 ? Math.round((totalWins / winTrades.length) * 100) / 100 : 0,
    avgLoss: lossTrades.length > 0 ? Math.round((totalLosses / lossTrades.length) * 100) / 100 : 0,
    profitFactor: totalLosses > 0 ? Math.round((totalWins / totalLosses) * 100) / 100 : totalWins > 0 ? Infinity : 0,
    bestTrade: Math.round(Math.max(...trades.map(t => t.result)) * 100) / 100,
    worstTrade: Math.round(Math.min(...trades.map(t => t.result)) * 100) / 100,
  };
}
