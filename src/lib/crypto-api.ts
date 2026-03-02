// CoinGecko API - FREE, no API key needed

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const CRYPTO_IDS = [
  'bitcoin',
  'ethereum',
  'ripple',
  'litecoin',
  'cardano',
  'solana',
  'dogecoin',
  'polkadot'
];

const CRYPTO_NAMES: Record<string, { symbol: string; name: string }> = {
  'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
  'ethereum': { symbol: 'ETH', name: 'Ethereum' },
  'ripple': { symbol: 'XRP', name: 'XRP' },
  'litecoin': { symbol: 'LTC', name: 'Litecoin' },
  'cardano': { symbol: 'ADA', name: 'Cardano' },
  'solana': { symbol: 'SOL', name: 'Solana' },
  'dogecoin': { symbol: 'DOGE', name: 'Dogecoin' },
  'polkadot': { symbol: 'DOT', name: 'Polkadot' }
};

// Cache for 60 seconds
let cache: { data: CryptoPrice[] | null; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_DURATION = 60000;

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.data;
  }
  
  try {
    const ids = CRYPTO_IDS.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const prices: CryptoPrice[] = CRYPTO_IDS.map(id => ({
      id,
      symbol: CRYPTO_NAMES[id]?.symbol || id.toUpperCase(),
      name: CRYPTO_NAMES[id]?.name || id,
      price: data[id]?.usd || 0,
      change24h: data[id]?.usd_24h_change || 0
    }));
    
    // Update cache
    cache = { data: prices, timestamp: now };
    
    return prices;
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    // Return cached data if available, even if expired
    if (cache.data) {
      return cache.data;
    }
    return [];
  }
}

export async function fetchSingleCryptoPrice(id: string): Promise<CryptoPrice | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data[id]) {
      return {
        id,
        symbol: CRYPTO_NAMES[id]?.symbol || id.toUpperCase(),
        name: CRYPTO_NAMES[id]?.name || id,
        price: data[id].usd || 0,
        change24h: data[id].usd_24h_change || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch crypto price:', error);
    return null;
  }
}

// Get quick prices for landing page (BTC and ETH only)
export async function fetchQuickCryptoPrices(): Promise<{ btc: CryptoPrice | null; eth: CryptoPrice | null }> {
  const prices = await fetchCryptoPrices();
  return {
    btc: prices.find(p => p.id === 'bitcoin') || null,
    eth: prices.find(p => p.id === 'ethereum') || null
  };
}
