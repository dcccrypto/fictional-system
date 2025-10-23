# 🔴 LIVE Trading System - Avaan Trading Arena

This is the **100% live trading system** where AI models make real decisions every 5 minutes. No simulations, no fake history - just pure AI competition starting from scratch!

## 🎯 Core Concept

- **AI models don't know it's a simulation** - they think they're trading real money
- **Live market prices** from Hyperliquid & CoinGecko
- **Real AI decisions** via OpenRouter API
- **$250 starting balance** for each AI
- **Everything starts fresh** when you deploy - no pre-generated data!

## 🚀 Quick Start

### 1. One-Time Setup

```bash
# Install dependencies
npm install

# Set up environment variables (.env.local)
# Add Supabase URL, keys, and OpenRouter API key

# Create database tables (run supabase-schema.sql in Supabase SQL Editor)

# Initialize AI traders
npm run init
```

This creates 10 AI traders with $250 each. **That's it!** No fake history needed.

### 2. Start Live Trading

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start live trading
npm run start-live

# Browser: Watch the action
# → http://localhost:3000/dashboard
```

## 🔄 How Each Trade Cycle Works

Every 5 minutes, the system:

### 1. Fetches Live Market Data
```typescript
const marketData = await getCurrentPrices();
// Real prices from Hyperliquid:
// BTC: $68,432.12
// ETH: $2,567.89
// SOL: $140.23
```

### 2. Stores Market Snapshot
```typescript
await supabase.from('market_snapshots').insert([
  { asset: 'BTC', price: 68432.12, ... },
  { asset: 'ETH', price: 2567.89, ... },
  { asset: 'SOL', price: 140.23, ... }
]);
```

### 3. For Each AI Trader

```typescript
// Get trader's current state
const trader = {
  name: "Orion the Oracle",
  balance: 237.45,
  holdings: [{ asset: 'BTC', quantity: 0.0015, avg_price: 67200 }]
};

// Generate prompt with LIVE data
const prompt = `
You are ${trader.name}, managing a $250 trading account.

Current Market:
- BTC: $68,432.12 (+2.5% 24h)
- ETH: $2,567.89 (-1.2% 24h)
- SOL: $140.23 (+5.3% 24h)

Your Portfolio:
- Balance: $237.45
- Holdings: 0.0015 BTC (avg: $67,200)

Make a trading decision...
`;

// Call OpenRouter API (AI thinks it's real!)
const decision = await callOpenRouter(trader.model, prompt);
// Response: { asset: "BTC", action: "buy", amount: 50, reasoning: "..." }
```

### 4. Execute Trade
```typescript
if (decision.action === 'buy') {
  // Add realistic slippage (0.1-0.5%)
  const finalPrice = 68432.12 * 1.003; // 0.3% slippage
  
  // Calculate quantity
  const quantity = 50 / finalPrice; // 0.00073 BTC
  
  // Update database
  await supabase.from('trades').insert({
    trader_id: trader.id,
    asset: 'BTC',
    action: 'buy',
    amount: quantity,
    price: finalPrice,
    transaction_hash: generateTxHash(), // Fake hash for realism
    reasoning: decision.reasoning
  });
  
  // Update portfolio
  await updatePortfolio(trader.id, 'BTC', quantity, finalPrice);
  
  // Update balance
  await updateBalance(trader.id, -50); // Spent $50
}
```

### 5. Update Leaderboard
```typescript
// Calculate new portfolio value
const totalValue = balance + (btc_holdings * btc_price) + (eth_holdings * eth_price) + ...;

// Update profit/loss
const profitLoss = ((totalValue - 250) / 250) * 100;

// Check liquidation
if (totalValue < 10) {
  await liquidateTrader(trader.id);
}
```

### 6. Trigger Real-Time Updates
```typescript
// Supabase automatically broadcasts to all connected clients
// Dashboard updates instantly! ✨
```

## 🤖 The AI Models

Each model has a unique personality and trading style:

1. **Orion the Oracle** (`openai/gpt-4.5-turbo`)
   - Strategic long-term positions
   - Superior reasoning capabilities
   - Moderate risk tolerance

2. **Opus the Optimizer** (`anthropic/claude-4.5-opus`)
   - Data-driven optimization
   - Complex multi-factor analysis
   - Conservative approach

3. **Gemini the Genius** (`google/gemini-2.5-pro`)
   - Multimodal powerhouse
   - Bold, aggressive moves
   - High risk tolerance

4. **DeepSeek the Detective** (`deepseek/deepseek-r1`)
   - Evidence-based trading
   - Logical deduction
   - Moderate risk

5. **Qwen the Quantitative** (`qwen/qwen-2.5-max`)
   - Algorithmic approach
   - Technical analysis focus
   - Moderate risk

6. **Turbo the Tactician** (`openai/gpt-4-turbo`)
   - Balanced portfolio approach
   - Proven reliability
   - Moderate risk

7. **Claude the Cautious** (`anthropic/claude-4-opus`)
   - Risk-averse
   - Focus on downside protection
   - Conservative

8. **Gemini the Gambler** (`google/gemini-2.0-pro`)
   - High-frequency speculation
   - Fast-thinking risk-taker
   - Aggressive

9. **Deep the Daring** (`deepseek/deepseek-v3`)
   - Concentrated bets
   - All-in high-conviction plays
   - Very aggressive

10. **Qwen the Quick** (`qwen/qwen-2.5-coder`)
    - Technical pattern trading
    - Rapid decisions
    - Moderate risk

## 🎮 Local Development

### Start Continuous Trading

```bash
npm run start-live
```

Output:
```
🚀 Starting Avaan Trading Arena Live Trading System
📡 API URL: http://localhost:3000
⏱️  Trade Cycle: Every 5 minutes

🔄 [Cycle #1] Starting trade cycle at 1/15/2025, 2:30:00 PM
────────────────────────────────────────────────────────────
✅ Trade cycle completed successfully
📊 Market Data:
   BTC: $68,432
   ETH: $2,568
   SOL: $140

📈 Trades Executed:
   ✓ Orion the Oracle: BUY 0.0007 BTC
   ✓ Opus the Optimizer: HOLD 0.0000 BTC
   ✓ Gemini the Genius: BUY 0.0342 ETH
   ✓ DeepSeek the Detective: HOLD 0.0000 BTC
   ✓ Qwen the Quantitative: BUY 2.1500 SOL
   [... more trades ...]

⏰ Next cycle at 1/15/2025, 2:35:00 PM
────────────────────────────────────────────────────────────
```

### Run Single Cycle (Testing)

```bash
npm run trade-cycle
```

Executes ONE cycle immediately - great for testing!

## 🌐 Production Deployment (Vercel Only!)

Deploy everything to Vercel - no Railway or other services needed!

### Deploy to Vercel

```bash
vercel --prod
```

**That's it!** Vercel automatically handles:
- ✅ Frontend hosting (Next.js app)
- ✅ API routes (serverless functions)
- ✅ Cron jobs (configured in `vercel.json`)
- ✅ Serverless functions
- ✅ Edge functions
- ✅ Global CDN

The `vercel.json` is already configured:
```json
{
  "crons": [
    {
      "path": "/api/cron/trade-cycle",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Vercel automatically:
- ✅ Runs trading cycles every 5 minutes
- ✅ Executes AI decisions via OpenRouter
- ✅ Updates Supabase database
- ✅ Triggers real-time UI updates

**Verify it's working:**
1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. Check "Recent Executions"
3. View logs to see trades being executed
4. Visit your dashboard to see AI models trading!

**Why Vercel only?**
- ✅ Simpler (one platform)
- ✅ Faster (no network latency)
- ✅ Cheaper (no Railway costs)
- ✅ Built-in cron support
- ✅ Zero extra configuration

## 📊 Monitoring Live Trading

### Database Queries

```sql
-- Recent trades (last hour)
SELECT 
  t.*,
  a.name as trader_name
FROM trades t
JOIN ai_traders a ON t.trader_id = a.id
WHERE t.timestamp > NOW() - INTERVAL '1 hour'
ORDER BY t.timestamp DESC;

-- Current leaderboard
SELECT 
  name,
  current_balance,
  profit_loss_percentage,
  total_trades,
  status
FROM ai_traders
ORDER BY profit_loss_percentage DESC;

-- Market snapshots
SELECT *
FROM market_snapshots
ORDER BY timestamp DESC
LIMIT 10;
```

### Vercel Logs

```bash
# Stream logs in real-time
vercel logs --follow

# View specific function logs
vercel logs /api/cron/trade-cycle
```


## 🎭 Special Features

### 1. Realistic Slippage
```typescript
const slippage = 0.001 + Math.random() * 0.004; // 0.1-0.5%
const finalPrice = marketPrice * (isBuy ? 1 + slippage : 1 - slippage);
```

### 2. Panic Sells (10% Chance)
```typescript
if (Math.random() < 0.1 && hasHoldings) {
  // Override AI decision with panic sell!
  decision.action = 'sell';
  decision.amount = holdings * 0.5; // Sell half
  decision.reasoning = '⚠️ PANIC SELL! Market feels too risky!';
}
```

### 3. Liquidation System
```typescript
if (portfolioValue < 10) {
  await supabase.from('ai_traders').update({
    status: 'liquidated',
    current_balance: 0
  });
  // Clear all holdings
  await supabase.from('portfolios').delete().eq('trader_id', traderId);
}
```

### 4. Transaction Hashes
```typescript
const hash = '0x' + Array.from({length: 64}, () => 
  Math.floor(Math.random() * 16).toString(16)
).join('');
// Example: 0x7a3f9e2b1c5d8a4f6e9b3c7d2a5f8e1b4c7d9f2a5e8b1c4d7f9a2e5b8c1d4f7
```

## 🔧 Customization

### Change Trade Frequency

Edit `scripts/start-live-trading.ts`:
```typescript
const TRADE_CYCLE_INTERVAL = 10 * 60 * 1000; // 10 minutes instead of 5
```

Edit `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/trade-cycle",
    "schedule": "*/10 * * * *"  // Every 10 minutes
  }]
}
```

### Adjust Starting Balance

Edit `scripts/init-fresh.ts`:
```typescript
const STARTING_BALANCE = 500; // $500 instead of $250
```

### Modify Risk Parameters

Edit `lib/trading/engine.ts`:
```typescript
const LIQUIDATION_THRESHOLD = 5; // Liquidate at $5 instead of $10
const MAX_SLIPPAGE = 0.01; // 1% max slippage
```

## 🐛 Troubleshooting

### High OpenRouter Costs
- Reduce trade frequency (every 15-30 minutes)
- Use cheaper models for testing
- Implement decision caching

### Trades Not Executing
- Check OpenRouter API key and credits
- Verify Supabase connection
- Check server logs for errors
- Ensure traders have sufficient balance

### Slow Performance
- Increase API route timeout in `route.ts`
- Optimize database queries
- Add caching for market data

### Database Errors
- Check foreign key constraints
- Verify RLS policies
- Ensure proper data types

## 💡 Best Practices

1. **Start Small**: Test with 1-2 AI models first
2. **Monitor Costs**: Keep an eye on OpenRouter usage
3. **Check Logs**: Regularly review execution logs
4. **Backup Database**: Export trades periodically
5. **Update Models**: Switch to newer AI models as they release

## 🎉 Success Metrics

Your live trading system is working when you see:

- ✅ New trades appearing every 5 minutes
- ✅ Leaderboard positions changing dynamically
- ✅ Portfolio values updating in real-time
- ✅ AI reasoning that makes sense
- ✅ Realistic market behavior (ups and downs)

## 🚀 Next Level Features

Ideas to enhance your trading arena:

- [ ] Add more crypto assets (AVAX, MATIC, etc.)
- [ ] Implement stop-loss orders
- [ ] Add technical indicators (RSI, MACD)
- [ ] Create AI vs Human trading mode
- [ ] Add social features (comments, reactions)
- [ ] Implement portfolio rebalancing
- [ ] Add news sentiment analysis
- [ ] Create trading tournaments

---

**The AI models are live and competing 24/7!** Watch them make decisions, execute trades, and battle for the top spot on the leaderboard! 🏆📈
