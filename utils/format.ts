/**
 * Utility functions for formatting data in the Avaan Trading Arena
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false
  } = options || {};

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(Math.abs(value));
  
  if (showSign && value !== 0) {
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
}

/**
 * Format a number as currency (USD) - compatible with existing metrics.ts
 */
export function formatCurrencySimple(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}): string {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = true
  } = options || {};

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(value / 100);
  
  if (showSign && value !== 0) {
    return value > 0 ? `+${formatted}` : formatted;
  }
  
  return formatted;
}

/**
 * Format a large number with appropriate suffixes (K, M, B)
 */
export function formatNumber(value: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 1
  } = options || {};

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  if (Math.abs(value) >= 1e9) {
    return formatter.format(value / 1e9) + 'B';
  } else if (Math.abs(value) >= 1e6) {
    return formatter.format(value / 1e6) + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return formatter.format(value / 1e3) + 'K';
  }
  
  return formatter.format(value);
}

/**
 * Format a timestamp as a relative time string
 */
export function formatTimeAgo(timestamp: Date | string | number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Format a timestamp as a readable date and time
 */
export function formatDateTime(timestamp: Date | string | number, options?: {
  includeTime?: boolean;
  includeSeconds?: boolean;
}): string {
  const {
    includeTime = true,
    includeSeconds = false
  } = options || {};

  const date = new Date(timestamp);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  };

  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
    if (includeSeconds) {
      dateOptions.second = '2-digit';
    }
  }

  return date.toLocaleString('en-US', dateOptions);
}

/**
 * Format a crypto asset amount with appropriate precision
 */
export function formatCryptoAmount(amount: number, asset: string): string {
  const precision = asset === 'BTC' ? 8 : asset === 'ETH' ? 6 : 4;
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(amount);
}

/**
 * Format a transaction hash for display
 */
export function formatTransactionHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) {
    return hash;
  }
  
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

/**
 * Format a balance with appropriate styling
 */
export function formatBalance(balance: number, options?: {
  showSign?: boolean;
  compact?: boolean;
}): string {
  const { showSign = false, compact = false } = options || {};

  if (compact && Math.abs(balance) >= 1000) {
    return formatNumber(balance, { maximumFractionDigits: 1 });
  }

  return formatCurrency(balance, { 
    showSign,
    maximumFractionDigits: 2 
  });
}

/**
 * Format a profit/loss value with color indication
 */
export function formatProfitLoss(value: number, options?: {
  showSign?: boolean;
  showPercentage?: boolean;
}): string {
  const { showSign = true, showPercentage = false } = options || {};

  if (showPercentage) {
    return formatPercentage(value, { showSign });
  }

  return formatCurrency(value, { showSign });
}

/**
 * Format a volume value
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(1)}K`;
  }
  
  return formatCurrency(volume);
}

/**
 * Format a price with appropriate precision
 */
export function formatPrice(price: number, asset: string): string {
  if (price >= 1000) {
    return formatCurrency(price, { maximumFractionDigits: 0 });
  } else if (price >= 1) {
    return formatCurrency(price, { maximumFractionDigits: 2 });
  } else {
    return formatCurrency(price, { maximumFractionDigits: 4 });
  }
}
