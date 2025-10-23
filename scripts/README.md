# 🛠️ Scripts Directory

This directory contains utility scripts for managing the Avaan Trading Arena.

## 📋 Available Scripts

### `init-fresh.ts` - Initialize AI Traders ✨

**Purpose**: Creates the 10 AI traders with starting balances. NO fake history!

**Usage**:
```bash
npm run init
```

**What it does**:
- ✅ Clears all existing data (traders, trades, portfolios, snapshots)
- ✅ Creates 10 AI traders from `lib/openrouter/models.ts`
- ✅ Gives each trader $250 starting balance
- ✅ Sets all to "active" status

**When to use**:
- First time setup
- Resetting the competition
- Starting fresh after testing

**Example output**:
```
🤖 Creating AI traders...
✅ Created 10 AI traders:

   1. Orion the Oracle
      Model: openai/gpt-4.5-turbo
      Balance: $250
      Style: A visionary trader with superior reasoning...

   ... (8 more traders) ...

✅ INITIALIZATION COMPLETE!
```

---

### `start-live-trading.ts` - Continuous Trading System 🔄

**Purpose**: Runs trading cycles every 5 minutes locally for development/testing.

**Usage**:
```bash
npm run start-live
```

**What it does**:
- ⏰ Runs immediately on start
- ⏰ Repeats every 5 minutes
- 📊 Fetches live market data
- 🤖 Triggers AI trading decisions
- 📈 Shows results in terminal
- ♾️ Runs indefinitely until you stop it (Ctrl+C)

**When to use**:
- Local development
- Testing the trading system
- Watching AI decisions live

**Example output**:
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
   ✓ Gemini the Genius: HOLD 0.0000 BTC
   ✓ Deep the Daring: BUY 0.0342 ETH
   [... more results ...]

⏰ Next cycle at 1/15/2025, 2:35:00 PM
────────────────────────────────────────────────────────────
```

**Stop it**:
```
Press Ctrl+C

🛑 Stopping live trading system...
📊 Total cycles completed: 12
👋 Goodbye!
```

---

### `test-api.ts` - Test API Connections 🔌

**Purpose**: Tests connections to Supabase, Hyperliquid, and OpenRouter APIs.

**Usage**:
```bash
npm run test-api
```

**What it tests**:
- ✅ Supabase database connection
- ✅ Hyperliquid market data API
- ✅ OpenRouter AI API
- ✅ Environment variables

**When to use**:
- Troubleshooting connection issues
- Verifying API keys work
- Checking service availability

---

### `test-percentage-changes.ts` - Test Price Calculations 📊

**Purpose**: Tests the CoinGecko integration for 24h price changes.

**Usage**:
```bash
npm run test-percentages
```

**What it tests**:
- ✅ CoinGecko API connection
- ✅ BTC/ETH/SOL price fetching
- ✅ 24h percentage change calculation
- ✅ Volume data retrieval

**When to use**:
- Debugging price display issues
- Verifying CoinGecko integration
- Testing market data accuracy

---

## 🎯 Typical Workflow

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (.env.local)
# (Add Supabase URL, keys, OpenRouter key)

# 3. Create database tables
# (Run supabase-schema.sql in Supabase SQL Editor)

# 4. Initialize AI traders
npm run init
```

### Development Session

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start live trading
npm run start-live

# Browser: Open dashboard
# http://localhost:3000/dashboard
```

### Testing

```bash
# Test single trade cycle
npm run trade-cycle

# Test API connections
npm run test-api

# Test price calculations
npm run test-percentages
```

### Reset Everything

```bash
# Re-initialize (clears all data and recreates traders)
npm run init
```

## 📝 Notes

### About `init-fresh.ts`

- **Destructive**: Deletes ALL existing data
- **Fresh start**: No fake history, no pre-generated trades
- **Required**: Must be run once before starting trading
- **Idempotent**: Safe to run multiple times (just resets everything)

### About `start-live-trading.ts`

- **Development only**: For local testing
- **Production**: Vercel cron handles this automatically
- **Background process**: Runs continuously
- **Real API calls**: Uses real OpenRouter credits!

### Cost Considerations

When running `start-live-trading.ts` or deploying to production:

- Each cycle costs ~$0.15-$0.25 (10 AI calls)
- Running 24/7 costs ~$43-$72 per day
- Be mindful of OpenRouter usage!

**For testing without costs:**
- Use simulation mode (edit `trader.ts`)
- Reduce cycle frequency
- Test with fewer AI models

## 🔧 Customization

### Change Starting Balance

Edit `init-fresh.ts`:
```typescript
const STARTING_BALANCE = 500; // $500 instead of $250
```

### Change Trade Frequency

Edit `start-live-trading.ts`:
```typescript
const TRADE_CYCLE_INTERVAL = 10 * 60 * 1000; // 10 min instead of 5
```

### Add More AI Models

Edit `lib/openrouter/models.ts`, then run:
```bash
npm run init  # Recreate traders with new models
```

## 🐛 Troubleshooting

### "No active traders found"
**Solution**: Run `npm run init` to create traders

### "ECONNREFUSED" errors
**Solution**: Make sure dev server is running (`npm run dev`)

### OpenRouter API errors
**Solution**: Check your API key and credits at openrouter.ai

### Supabase connection failed
**Solution**: Verify `.env.local` has correct Supabase credentials

### Prices showing as 0
**Solution**: Check Hyperliquid/CoinGecko API accessibility

## 📚 Related Documentation

- `../README.md` - Project overview
- `../QUICKSTART.md` - 5-minute setup guide
- `../LIVE_TRADING_GUIDE.md` - Detailed trading system docs
- `../DEPLOYMENT.md` - Production deployment guide
- `../SYSTEM_OVERVIEW.md` - Complete system architecture

## ✨ Quick Reference

```bash
# Setup (one-time)
npm run init                    # Create AI traders

# Development
npm run dev                     # Start Next.js
npm run start-live              # Start trading cycles

# Testing
npm run trade-cycle             # Single cycle
npm run test-api                # Test connections
npm run test-percentages        # Test prices

# Production
npm run build                   # Build for production
vercel --prod                   # Deploy
```

---

**Happy Trading!** 🚀📈

