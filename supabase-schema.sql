-- Avaan Trading Arena Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AI Traders Table
CREATE TABLE IF NOT EXISTS ai_traders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  personality TEXT NOT NULL,
  initial_balance DECIMAL(20, 2) NOT NULL DEFAULT 250.00,
  current_balance DECIMAL(20, 2) NOT NULL DEFAULT 250.00,
  total_trades INTEGER NOT NULL DEFAULT 0,
  profit_loss_percentage DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'liquidated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades Table
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trader_id TEXT NOT NULL REFERENCES ai_traders(id) ON DELETE CASCADE,
  asset TEXT NOT NULL CHECK (asset IN ('BTC', 'ETH', 'SOL')),
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell', 'hold')),
  amount DECIMAL(20, 8) NOT NULL,
  price DECIMAL(20, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_hash TEXT NOT NULL UNIQUE,
  reasoning TEXT,
  slippage DECIMAL(20, 2) DEFAULT 0.00
);

-- Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trader_id TEXT NOT NULL REFERENCES ai_traders(id) ON DELETE CASCADE,
  asset TEXT NOT NULL CHECK (asset IN ('BTC', 'ETH', 'SOL')),
  quantity DECIMAL(20, 8) NOT NULL,
  average_buy_price DECIMAL(20, 2) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trader_id, asset)
);

-- Market Snapshots Table
CREATE TABLE IF NOT EXISTS market_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset TEXT NOT NULL CHECK (asset IN ('BTC', 'ETH', 'SOL')),
  price DECIMAL(20, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trades_trader_id ON trades(trader_id);
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trades_asset ON trades(asset);
CREATE INDEX IF NOT EXISTS idx_portfolios_trader_id ON portfolios(trader_id);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_asset ON market_snapshots(asset);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public leaderboard)
CREATE POLICY "Public read access for ai_traders" ON ai_traders
  FOR SELECT USING (true);

CREATE POLICY "Public read access for trades" ON trades
  FOR SELECT USING (true);

CREATE POLICY "Public read access for portfolios" ON portfolios
  FOR SELECT USING (true);

CREATE POLICY "Public read access for market_snapshots" ON market_snapshots
  FOR SELECT USING (true);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access to ai_traders" ON ai_traders
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to trades" ON trades
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to portfolios" ON portfolios
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to market_snapshots" ON market_snapshots
  USING (true)
  WITH CHECK (true);

-- Enable real-time for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE ai_traders;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE market_snapshots;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on portfolios
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Avaan Trading Arena database schema created successfully!';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '   1. Run the seed script: npm run seed';
    RAISE NOTICE '   2. Set up Vercel Cron for /api/cron/trade-cycle';
    RAISE NOTICE '   3. Configure environment variables';
END $$;


