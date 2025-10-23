// Core Types for Avaan Trading Arena

export interface AITrader {
  id: string;
  name: string;
  model_name: string;
  personality: string;
  initial_balance: number;
  current_balance: number;
  total_trades: number;
  profit_loss_percentage: number;
  status: 'active' | 'liquidated';
  created_at: string;
}

export interface Trade {
  id: string;
  trader_id: string;
  asset: CryptoAsset;
  action: TradeAction;
  amount: number;
  price: number;
  timestamp: string;
  transaction_hash: string;
  reasoning: string;
  slippage: number;
}

export interface Portfolio {
  id: string;
  trader_id: string;
  asset: CryptoAsset;
  quantity: number;
  average_buy_price: number;
  updated_at: string;
}

export interface MarketSnapshot {
  id: string;
  asset: CryptoAsset;
  price: number;
  timestamp: string;
  metadata: {
    volume_24h?: number;
    change_24h?: number;
    high_24h?: number;
    low_24h?: number;
  };
}

// CryptoAsset is now a string to support all Hyperliquid perpetuals dynamically
export type CryptoAsset = string;
export type TradeAction = 'buy' | 'sell' | 'hold';

export interface TradingDecision {
  asset: string;
  action: TradeAction;
  amount: number;
  reasoning: string;
}

export interface MarketData {
  [key: string]: AssetPrice;
}

export interface AssetPrice {
  price: number;
  change_24h: number;
  volume_24h?: number;
  high_24h?: number;
  low_24h?: number;
}

export interface LeaderboardEntry extends AITrader {
  rank: number;
  portfolio_value: number;
  recent_trades: Trade[];
}

export interface AdvancedMetrics {
  sharpe_ratio: number;
  max_drawdown: number;
  win_rate: number;
  total_profit: number;
  total_loss: number;
  best_trade: number;
  worst_trade: number;
}

// OpenRouter AI Models Configuration
export interface AIModelConfig {
  id: string;
  name: string;
  model_identifier: string;
  personality: string;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  trading_style: string;
}

// API Response Types
export interface HyperliquidAllMidsResponse {
  [key: string]: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}


