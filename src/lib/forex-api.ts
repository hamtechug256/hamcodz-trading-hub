// ExchangeRate-API - FREE, no API key needed

export interface ForexRate {
  pair: string;
  rate: number;
  lastUpdate: string;
}

// Cache for 60 seconds
let cache: { data: Record<string, number> | null; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_DURATION = 60000;

const FOREX_PAIRS = [
  { base: 'EUR', quote: 'USD' },
  { base: 'GBP', quote: 'USD' },
  { base: 'USD', quote: 'JPY' },
  { base: 'AUD', quote: 'USD' },
  { base: 'USD', quote: 'CAD' },
  { base: 'USD', quote: 'CHF' },
  { base: 'NZD', quote: 'USD' }
];

export async function fetchForexRates(): Promise<ForexRate[]> {
  const now = Date.now();
  let rates: Record<string, number>;
  
  // Return cached data if still valid
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    rates = cache.data;
  } else {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      
      if (!response.ok) {
        throw new Error(`ExchangeRate API error: ${response.status}`);
      }
      
      const data = await response.json();
      rates = data.rates;
      
      // Update cache
      cache = { data: rates, timestamp: now };
    } catch (error) {
      console.error('Failed to fetch forex rates:', error);
      // Return cached data if available, even if expired
      if (cache.data) {
        rates = cache.data;
      } else {
        return [];
      }
    }
  }
  
  const lastUpdate = new Date(cache.timestamp).toLocaleTimeString();
  
  return FOREX_PAIRS.map(({ base, quote }) => {
    let rate: number;
    
    if (quote === 'USD') {
      // e.g., EUR/USD = 1 / USD_EUR_rate
      rate = 1 / (rates[base] || 1);
    } else if (base === 'USD') {
      // e.g., USD/JPY = JPY_rate
      rate = rates[quote] || 1;
    } else {
      // Cross pair calculation
      rate = (rates[quote] || 1) / (rates[base] || 1);
    }
    
    return {
      pair: `${base}/${quote}`,
      rate: Math.round(rate * 100000) / 100000,
      lastUpdate
    };
  });
}

export async function fetchQuickForexRates(): Promise<{ eurusd: ForexRate | null; gbpusd: ForexRate | null }> {
  const rates = await fetchForexRates();
  return {
    eurusd: rates.find(r => r.pair === 'EUR/USD') || null,
    gbpusd: rates.find(r => r.pair === 'GBP/USD') || null
  };
}

export function formatForexRate(rate: number): string {
  if (rate >= 100) {
    // JPY pairs
    return rate.toFixed(2);
  }
  return rate.toFixed(5);
}
