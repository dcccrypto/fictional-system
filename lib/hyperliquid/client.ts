import axios from 'axios';
import { MarketData, CryptoAsset } from '@/types';

const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Major coins for CoinGecko (for 24h changes)
const MAJOR_COINS_COINGECKO: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'AVAX': 'avalanche-2',
  'BNB': 'binancecoin',
  'MATIC': 'matic-network',
  'ATOM': 'cosmos',
  'DOGE': 'dogecoin',
  'DOT': 'polkadot',
  'UNI': 'uniswap'
};

// Cache for price data (30 seconds)
let priceCache: {
  data: MarketData | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 30 * 1000; // 30 seconds

/**
 * Fetches ALL available perpetuals from Hyperliquid
 */
export async function getAllAvailableAssets(): Promise<string[]> {
  try {
    const response = await axios.post(HYPERLIQUID_API_URL, {
      type: 'allMids'
    });

    const mids = response.data as Record<string, string>;
    return Object.keys(mids);
  } catch (error) {
    console.error('Error fetching available assets:', error);
    // Fallback to major coins
    return ['BTC', 'ETH', 'SOL', 'AVAX', 'BNB', 'MATIC'];
  }
}

/**
 * Fetches current prices for ALL available assets on Hyperliquid
 */
export async function getCurrentPrices(): Promise<MarketData> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION) {
    return priceCache.data;
  }

  try {
    // Get ALL prices from Hyperliquid
    const response = await axios.post(HYPERLIQUID_API_URL, {
      type: 'allMids'
    });

    const mids = response.data as Record<string, string>;
    
    // Get 24h changes from CoinGecko for major coins
    let coingeckoMap = new Map();
    try {
      const coingeckoIds = Object.values(MAJOR_COINS_COINGECKO).join(',');
      const coingeckoResponse = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coingeckoIds,
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });

      coingeckoResponse.data.forEach((coin: any) => {
        // Find the symbol that matches this coin
        for (const [symbol, id] of Object.entries(MAJOR_COINS_COINGECKO)) {
          if (id === coin.id) {
            coingeckoMap.set(symbol, coin);
            break;
          }
        }
      });
    } catch (cgError) {
      console.warn('CoinGecko API failed, using default changes:', cgError);
    }

    // Build market data for ALL assets
    const marketData: MarketData = {};
    
    for (const [asset, priceStr] of Object.entries(mids)) {
      const price = parseFloat(priceStr);
      const coinData = coingeckoMap.get(asset);
      
      marketData[asset] = {
        price,
        change_24h: coinData?.price_change_percentage_24h || 0,
        volume_24h: coinData?.total_volume || 0,
      };
    }
    
    console.log(`Fetched ${Object.keys(marketData).length} assets from Hyperliquid`);

    // Update cache
    priceCache = {
      data: marketData,
      timestamp: now
    };

    return marketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Return fallback data if API fails
    return {
      BTC: { price: 68432.12, change_24h: 2.5, volume_24h: 25000000000 },
      ETH: { price: 2567.89, change_24h: 1.8, volume_24h: 12000000000 },
      SOL: { price: 142.56, change_24h: -0.5, volume_24h: 2500000000 }
    };
  }
}

/**
 * Gets top N assets by volume or market cap
 */
export function getTopAssets(marketData: MarketData, count: number = 10): string[] {
  return Object.entries(marketData)
    .sort(([, a], [, b]) => (b.volume_24h || 0) - (a.volume_24h || 0))
    .slice(0, count)
    .map(([asset]) => asset);
}

/**
 * Gets market metadata for a specific asset
 */
export async function getMarketMeta(asset: CryptoAsset) {
  try {
    // Get additional data from Hyperliquid
    const response = await axios.post(HYPERLIQUID_API_URL, {
      type: 'metaAndAssetCtxs'
    });

    const assetCtxs = response.data[0]?.universe || [];
    const assetData = assetCtxs.find((ctx: any) => ctx.name === asset);

    // Try to get CoinGecko data if available
    let volume_24h = 0;
    if (MAJOR_COINS_COINGECKO[asset]) {
      try {
        const coingeckoId = MAJOR_COINS_COINGECKO[asset];
        const coingeckoResponse = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: coingeckoId,
            order: 'market_cap_desc',
            per_page: 1,
            page: 1,
            sparkline: false
          }
        });
        volume_24h = coingeckoResponse.data[0]?.total_volume || 0;
      } catch (cgError) {
        // Silently fail
      }
    }

    return {
      volume_24h,
      open_interest: assetData ? parseFloat(assetData.openInterest || '0') : 0,
      funding_rate: assetData ? parseFloat(assetData.funding || '0') : 0,
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${asset}:`, error);
    return {
      volume_24h: 0,
      open_interest: 0,
      funding_rate: 0,
    };
  }
}

/**
 * Gets price history for charting
 */
export async function getPriceHistory(
  asset: CryptoAsset,
  interval: string = '1h',
  startTime?: number,
  endTime?: number
) {
  try {
    const response = await axios.post(HYPERLIQUID_API_URL, {
      type: 'candleSnapshot',
      req: {
        coin: asset,
        interval,
        startTime,
        endTime
      }
    });

    return response.data.map((candle: any) => ({
      timestamp: candle.t,
      open: parseFloat(candle.o),
      high: parseFloat(candle.h),
      low: parseFloat(candle.l),
      close: parseFloat(candle.c),
      volume: parseFloat(candle.v)
    }));
  } catch (error) {
    console.error(`Error fetching price history for ${asset}:`, error);
    return [];
  }
}

/**
 * Fetches 24h price changes from CoinGecko for a specific asset
 */
export async function get24hChange(asset: CryptoAsset): Promise<number> {
  try {
    const coingeckoId = MAJOR_COINS_COINGECKO[asset];
    if (!coingeckoId) return 0;
    
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coingeckoId,
        order: 'market_cap_desc',
        per_page: 1,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });

    const data = response.data[0];
    return data?.price_change_percentage_24h || 0;
  } catch (error) {
    console.error(`Error fetching 24h change for ${asset}:`, error);
    return 0;
  }
}

/**
 * Clear the price cache (useful for testing or forced refresh)
 */
export function clearPriceCache() {
  priceCache = {
    data: null,
    timestamp: 0
  };
}
