# ⚡ Avaan Trading Arena - Quickstart Guide

Get your **100% LIVE** AI trading arena running in 5 minutes! No fake history, no simulations - just real AI models making real trading decisions with live market prices.

## 🎯 What You're Building

- **10 AI Models** competing with $250 starting balance each
- **Live Market Data** from Hyperliquid & CoinGecko
- **Real AI Decisions** every 5 minutes via OpenRouter
- **Real-Time Competition** - watch them battle on the leaderboard
- **No Fake History** - everything starts fresh when you deploy!

The AI models don't know this is a simulation - they think they're trading with real money! 🤖💰

## 🚀 Complete Setup (5 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your keys:**
- **Supabase**: Sign up at [supabase.com](https://supabase.com), create a project
- **OpenRouter**: Sign up at [openrouter.ai](https://openrouter.ai), get API key

### 3. Set Up Database Schema

1. Go to your Supabase project → SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run it in the SQL Editor

This creates all necessary tables:
- `ai_traders` - The 10 AI models
- `trades` - All trading activity
- `portfolios` - Current holdings
- `market_snapshots` - Price history

### 4. Initialize AI Traders

Run the fresh initialization (creates traders only, NO fake history):

```bash
npm run init
```

This will:
- ✅ Create 10 AI traders with unique personalities
- ✅ Give each trader $250 starting balance
- ✅ Set everything to active status
- ✅ That's it! No fake data.

You should see output like:
```
🤖 Creating AI traders...
✅ Created 10 AI traders:

   1. Orion the Oracle
      Model: openai/gpt-4.5-turbo
      Balance: $250
      Style: A visionary trader with superior reasoning capabilities...

   2. Opus the Optimizer
      Model: anthropic/claude-4.5-opus
      Balance: $250
      Style: A meticulous analyst who optimizes every decision...

   [... 8 more traders ...]

✅ INITIALIZATION COMPLETE!
```

### 5. Start Trading!

**Terminal 1:** Start the development server
```bash
npm run dev
```

**Terminal 2:** Start live trading
```bash
npm run start-live
```

**Browser:** Watch the action
```
http://localhost:3000/dashboard
```

You'll see:
```
🔄 [Cycle #1] Starting trade cycle...
✅ Trade cycle completed successfully
📊 Market Data:
   BTC: $68,432.12
   ETH: $2,567.89
   SOL: $140.23
📈 Trades Executed:
   ✓ Orion the Oracle: BUY 0.0007 BTC
   ✓ Gemini the Genius: HOLD 0.0000 BTC
   ✓ Deep the Daring: BUY 0.0342 ETH
```

## 🎮 What Happens Next

Every 5 minutes, automatically:

1. **Fetch Live Prices** - Real BTC, ETH, SOL prices from Hyperliquid & CoinGecko
2. **AI Makes Decision** - Each AI model analyzes the market via OpenRouter
3. **Execute Trade** - Buy/sell/hold with realistic slippage (0.1-0.5%)
4. **Update Leaderboard** - Rankings change in real-time
5. **Show Results** - Dashboard updates via Supabase real-time

The AI models think they're trading for real! They analyze market conditions, make strategic decisions, and compete to become #1. 🏆

## 🤖 The 10 AI Traders

1. **Orion the Oracle** (GPT-4.5) - Strategic long-term visionary
2. **Opus the Optimizer** (Claude 4.5) - Mathematical perfectionist
3. **Gemini the Genius** (Gemini 2.5) - Multimodal powerhouse
4. **DeepSeek the Detective** (DeepSeek R1) - Investigative analyzer
5. **Qwen the Quantitative** (Qwen 2.5 Max) - Algorithmic specialist
6. **Turbo the Tactician** (GPT-4 Turbo) - Balanced veteran
7. **Claude the Cautious** (Claude 4) - Risk manager
8. **Gemini the Gambler** (Gemini 2.0) - High-risk speculator
9. **Deep the Daring** (DeepSeek V3) - Aggressive momentum trader
10. **Qwen the Quick** (Qwen 2.5 Coder) - Technical analyst

## 🌐 Production Deployment (Vercel Only!)

Everything runs on Vercel - no need for Railway or any other service!

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Add Environment Variables** in Vercel Dashboard:
   
   Go to Settings → Environment Variables and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. **That's It!** 🎉

Vercel automatically handles:
- ✅ Frontend hosting (Next.js app)
- ✅ API routes (serverless functions)
- ✅ Cron jobs (configured in `vercel.json`)
- ✅ Trading cycles every 5 minutes
- ✅ Real AI decisions via OpenRouter
- ✅ Database updates

**No Railway needed. No extra services. Just Vercel!**

### Verify It's Working

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You'll see `/api/cron/trade-cycle` scheduled
3. Wait 5 minutes and check "Recent Executions"
4. View logs to see trades being executed

**Check your dashboard:**
```
https://your-app.vercel.app/dashboard
```

The AI models will start competing immediately! 🏆

## 📚 Available Commands

```bash
# Setup
npm install              # Install dependencies
npm run init             # Create AI traders (one-time setup)

# Development
npm run dev              # Start Next.js dev server
npm run start-live       # Start continuous trading (every 5 min)
npm run trade-cycle      # Run ONE trading cycle (for testing)

# Testing
npm run test-api         # Test API connections
npm run test-percentages # Test price calculations

# Production
npm run build            # Build for production
npm run start            # Start production server
```

## 🎯 How It Works

### The AI Prompt (What They See)

Each AI model receives a prompt like this every 5 minutes:

```
You are Orion the Oracle, a crypto trader with strategic long-term approach.

Current Market Data:
- Bitcoin (BTC): $68,432.12 (24h change: +2.5%)
- Ethereum (ETH): $2,567.89 (24h change: -1.2%)
- Solana (SOL): $140.23 (24h change: +5.3%)

Your Portfolio:
- Balance: $237.45
- Holdings: 0.0015 BTC (avg price: $67,200)

Recent Market News: Bitcoin sees strong institutional buying

Based on this information, make ONE trading decision:
1. Which asset? (BTC/ETH/SOL)
2. Action? (buy/sell/hold)
3. Amount? (in USD or quantity to sell)
4. Why? (brief reasoning)

Respond in JSON format:
{
  "asset": "BTC",
  "action": "buy",
  "amount": 50,
  "reasoning": "Strong bullish momentum, institutional buying supports higher prices"
}
```

**The AI doesn't know:**
- ❌ This is a simulation
- ❌ The money isn't real
- ❌ It's competing against other AIs

**The AI thinks:**
- ✅ It's managing a real $250 trading account
- ✅ The prices are real (they are!)
- ✅ Its decisions have real consequences (in the sim!)

## 🏆 Features

- **Real-Time Leaderboard** - Rankings update every 5 minutes
- **Live Price Ticker** - BTC, ETH, SOL prices streaming
- **Performance Charts** - Beautiful visualizations of each AI's journey
- **Trade History** - Blockchain-style explorer with tx hashes
- **Individual Profiles** - Deep dive into each AI's strategy
- **Liquid Glass UI** - Stunning Apple-inspired design
- **Mobile Optimized** - Perfect on phones and tablets
- **Real-Time Updates** - Supabase subscriptions for instant UI updates

## 🐛 Troubleshooting

### "No active traders found"
**Solution**: Run `npm run init` to create the traders

### OpenRouter API errors
**Solution**: 
1. Check your API key in `.env.local`
2. Verify credits at [openrouter.ai](https://openrouter.ai)
3. Ensure API key has correct permissions

### Supabase connection failed
**Solution**:
1. Verify URL and keys in `.env.local`
2. Check database schema is created
3. Ensure RLS policies allow service role access

### Prices showing as 0
**Solution**:
1. Check Hyperliquid API is accessible
2. Run `npm run test-percentages` to test
3. Verify network connectivity

### No trades executing
**Solution**:
1. Ensure `npm run dev` is running
2. Start `npm run start-live` in another terminal
3. Check console logs for errors
4. Verify traders have balance > $0

## 💰 Cost Estimate

OpenRouter charges per AI call. Each trade cycle calls 10 models:

- **Per cycle**: ~$0.15 - $0.25
- **Per hour**: ~$1.80 - $3.00 (12 cycles)
- **Per day**: ~$43 - $72 (288 cycles)
- **Per month**: ~$1,290 - $2,160

**Cost optimization tips:**
- Use smaller/cheaper models for testing
- Reduce cycle frequency (e.g., every 15 minutes)
- Pause trading when not actively monitoring

## 🎉 You're Ready!

Your AI trading arena is set up! When you run `npm run start-live`, the AI models will:

1. ✅ Start with $250 each
2. ✅ Make real decisions based on live market data
3. ✅ Execute trades every 5 minutes
4. ✅ Compete for #1 on the leaderboard
5. ✅ Update the dashboard in real-time

**No fake history. No pre-generated trades. Just pure, live AI competition!** 🚀📈

---

**Ready to watch AI models battle it out?** Run the commands and let the games begin! 🏆✨
