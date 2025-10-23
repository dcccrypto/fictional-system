import { Trade } from '@/types';

/**
 * Calculates the Sharpe ratio for a trader's performance
 * Higher is better (> 1 is good, > 2 is excellent)
 */
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length < 2) return 0;

  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  return (avgReturn - riskFreeRate) / stdDev;
}

/**
 * Calculates maximum drawdown (largest peak-to-trough decline)
 * Returns a negative percentage
 */
export function calculateMaxDrawdown(balanceHistory: number[]): number {
  if (balanceHistory.length < 2) return 0;

  let maxDrawdown = 0;
  let peak = balanceHistory[0];

  for (const balance of balanceHistory) {
    if (balance > peak) {
      peak = balance;
    }
    const drawdown = ((balance - peak) / peak) * 100;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

/**
 * Calculates win rate (percentage of profitable trades)
 */
export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;

  const tradePairs: { buy?: Trade; sell?: Trade }[] = [];
  const buyTrades = trades.filter(t => t.action === 'buy');
  const sellTrades = trades.filter(t => t.action === 'sell');

  // Simple pairing - each sell is matched with most recent buy of same asset
  for (const sell of sellTrades) {
    const matchingBuy = buyTrades
      .filter(b => b.asset === sell.asset && new Date(b.timestamp) < new Date(sell.timestamp))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (matchingBuy) {
      tradePairs.push({ buy: matchingBuy, sell });
    }
  }

  if (tradePairs.length === 0) return 0;

  const profitableTrades = tradePairs.filter(pair => {
    if (!pair.buy || !pair.sell) return false;
    return pair.sell.price > pair.buy.price;
  });

  return (profitableTrades.length / tradePairs.length) * 100;
}

/**
 * Calculates total profit from all trades
 */
export function calculateTotalProfit(trades: Trade[]): number {
  let totalProfit = 0;

  for (const trade of trades) {
    if (trade.action === 'sell') {
      // Profit from selling
      totalProfit += trade.amount * trade.price;
    } else if (trade.action === 'buy') {
      // Cost of buying
      totalProfit -= trade.amount * trade.price;
    }
  }

  return totalProfit;
}

/**
 * Calculates total loss from all trades
 */
export function calculateTotalLoss(trades: Trade[]): number {
  const buyTrades = trades.filter(t => t.action === 'buy');
  const sellTrades = trades.filter(t => t.action === 'sell');

  let totalLoss = 0;

  for (const sell of sellTrades) {
    const matchingBuys = buyTrades.filter(b => 
      b.asset === sell.asset && new Date(b.timestamp) < new Date(sell.timestamp)
    );

    if (matchingBuys.length > 0) {
      const avgBuyPrice = matchingBuys.reduce((sum, b) => sum + b.price, 0) / matchingBuys.length;
      if (sell.price < avgBuyPrice) {
        totalLoss += sell.amount * (avgBuyPrice - sell.price);
      }
    }
  }

  return totalLoss;
}

/**
 * Finds the best trade (highest profit)
 */
export function findBestTrade(trades: Trade[]): number {
  const buyTrades = trades.filter(t => t.action === 'buy');
  const sellTrades = trades.filter(t => t.action === 'sell');

  let bestProfit = 0;

  for (const sell of sellTrades) {
    const matchingBuys = buyTrades.filter(b =>
      b.asset === sell.asset && new Date(b.timestamp) < new Date(sell.timestamp)
    );

    if (matchingBuys.length > 0) {
      const avgBuyPrice = matchingBuys.reduce((sum, b) => sum + b.price, 0) / matchingBuys.length;
      const profit = sell.amount * (sell.price - avgBuyPrice);
      if (profit > bestProfit) {
        bestProfit = profit;
      }
    }
  }

  return bestProfit;
}

/**
 * Finds the worst trade (biggest loss)
 */
export function findWorstTrade(trades: Trade[]): number {
  const buyTrades = trades.filter(t => t.action === 'buy');
  const sellTrades = trades.filter(t => t.action === 'sell');

  let worstLoss = 0;

  for (const sell of sellTrades) {
    const matchingBuys = buyTrades.filter(b =>
      b.asset === sell.asset && new Date(b.timestamp) < new Date(sell.timestamp)
    );

    if (matchingBuys.length > 0) {
      const avgBuyPrice = matchingBuys.reduce((sum, b) => sum + b.price, 0) / matchingBuys.length;
      const profit = sell.amount * (sell.price - avgBuyPrice);
      if (profit < worstLoss) {
        worstLoss = profit;
      }
    }
  }

  return worstLoss;
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Formats a crypto amount
 */
export function formatCrypto(value: number, asset: string, decimals: number = 4): string {
  return `${value.toFixed(decimals)} ${asset}`;
}


