# 🚀 Avaan Trading Arena - Production Deployment Guide

Complete guide for deploying your **100% live** AI trading arena to production using **Vercel only**. No Railway needed - Vercel handles everything!

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION SETUP (Vercel Only)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────┐               │
│  │            VERCEL                    │               │
│  │   (All-in-One Platform)              │               │
│  │                                       │               │
│  │  • Next.js Frontend                  │               │
│  │  • Dashboard & UI                    │               │
│  │  • API Routes (Serverless)           │               │
│  │  • Cron Jobs (Auto Every 5 min)      │               │
│  │  • Edge Functions                    │               │
│  └────────────┬─────────────────────────┘               │
│               │                                          │
│               │                                          │
│               ▼                                          │
│  ┌─────────────────────────────────┐                   │
│  │         SUPABASE                │                   │
│  │    (PostgreSQL + Realtime)      │                   │
│  │                                  │                   │
│  │  • ai_traders                    │                   │
│  │  • trades                        │                   │
│  │  • portfolios                    │                   │
│  │  • market_snapshots              │                   │
│  └─────────────────────────────────┘                   │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │  OPENROUTER  │         │  HYPERLIQUID │             │
│  │   (AI API)   │         │  (Prices)    │             │
│  └──────────────┘         └──────────────┘             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Supabase project set up with schema
- ✅ OpenRouter API key with credits
- ✅ Vercel account
- ✅ All environment variables ready

**That's it! Just 3 services needed. Everything runs on Vercel!**

## 🗄️ Step 1: Set Up Supabase (Database)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `avaan-trading-arena`
   - Database Password: (save this securely!)
   - Region: Choose closest to your users

### 1.2 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Open `supabase-schema.sql` from your project
3. Copy and paste the entire contents
4. Click "Run" to create all tables

### 1.3 Get API Keys

1. Go to Settings → API
2. Copy these values:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` `public` key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `service_role` `secret` key (`SUPABASE_SERVICE_ROLE_KEY`)

### 1.4 Configure Realtime (Optional but Recommended)

1. Go to Database → Replication
2. Enable replication for these tables:
   - `ai_traders`
   - `trades`
   - `portfolios`
   - `market_snapshots`

This enables real-time updates on your dashboard! ⚡

## ▲ Step 2: Deploy to Vercel

Vercel will host **everything** - frontend, API routes, AND automatic cron jobs!

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Deploy

```bash
# From your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? avaan-trading-arena
# - Directory? ./
# - Override settings? No
```

### 2.3 Set Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables:

Add these for **Production**, **Preview**, and **Development**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=sk-or-v1-your-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important**: After adding variables, redeploy:

```bash
vercel --prod
```

### 2.4 Verify Cron Jobs

The `vercel.json` is already configured to run trades automatically:

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

**Check it's working:**

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You'll see `/api/cron/trade-cycle` scheduled for `*/5 * * * *`
3. Wait 5 minutes and check "Recent Executions"
4. View logs to see trades being executed

**That's it! Vercel automatically:**
- ✅ Runs your cron job every 5 minutes
- ✅ Executes AI trading decisions
- ✅ Updates the database
- ✅ Triggers real-time UI updates

No Railway, no separate backend, no extra configuration! 🎉

## 🎮 Step 3: Initialize AI Traders

Now that everything is deployed, create your AI traders:

### 3.1 Run Initialization Locally

```bash
# Make sure .env.local has your PRODUCTION Supabase credentials
npm run init
```

This creates the 10 AI traders with $250 each in your **production database**.

### 3.2 Verify in Supabase

1. Go to Supabase → Table Editor
2. Check `ai_traders` table
3. You should see 10 traders, each with:
   - `current_balance`: 250
   - `status`: "active"
   - `total_trades`: 0

## 🔍 Step 4: Monitor & Verify

### 4.1 Check Dashboard

Visit your live dashboard:
```
https://your-app.vercel.app/dashboard
```

You should see:
- ✅ 10 AI traders listed
- ✅ All with $250 balance
- ✅ 0% profit/loss (they haven't traded yet!)

### 4.2 Wait for First Trade Cycle

Wait 5 minutes for the first automatic trade cycle.

**Check Vercel Logs:**
```bash
vercel logs --follow
```

You should see:
```
🔄 Starting trade cycle...
📊 Market Data: BTC: $68,432, ETH: $2,567, SOL: $140
🤖 Processing 10 traders...
💡 Orion the Oracle: buy 0.0007 BTC
💡 Opus the Optimizer: hold 0.0000 BTC
💡 Gemini the Genius: buy 0.0342 ETH
✅ Trade cycle completed
```

### 4.3 Check Database

Go to Supabase → Table Editor → `trades`:
- You should see new trades appearing every 5 minutes!

### 4.4 Watch Real-Time Updates

Open your dashboard and watch:
- 🔄 Leaderboard positions change
- 📈 Balance updates in real-time
- 🆕 New trades appearing instantly
- 🏆 Profit/loss percentages updating

## 🔐 Security Checklist

- [ ] **Environment Variables**: Never commit `.env.local` to git
- [ ] **API Keys**: Use Vercel's environment variables (encrypted)
- [ ] **Supabase RLS**: Ensure Row Level Security is configured
- [ ] **Service Role Key**: Only used server-side (API routes)
- [ ] **HTTPS**: Vercel automatically provides SSL certificates

## 💰 Cost Breakdown

### OpenRouter (AI API)
- **Per cycle**: ~$0.15 - $0.25 (10 AI calls)
- **Per day**: ~$43 - $72 (288 cycles)
- **Per month**: ~$1,290 - $2,160

**Optimization:**
- Use cheaper models for testing
- Reduce frequency to every 15-30 minutes
- Implement caching for similar market conditions

### Supabase
- **Free tier**: Up to 500MB database, 2GB bandwidth
- **Pro**: $25/month for more resources
- **Cost**: Likely free or $25/month

### Vercel
- **Hobby**: Free for personal projects
- **Pro**: $20/month for production apps
- **Cost**: Free or $20/month

**Total Estimated Monthly Cost**: $1,290 - $2,205

**Main cost**: OpenRouter API (this is where the AI magic happens!)

## 🎛️ Configuration Options

### Adjust Trade Frequency

Edit `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/trade-cycle",
    "schedule": "*/15 * * * *"  // Every 15 minutes instead of 5
  }]
}
```

Then redeploy:
```bash
vercel --prod
```

### Change Starting Balance

Edit `scripts/init-fresh.ts`:
```typescript
const STARTING_BALANCE = 500; // $500 instead of $250
```

Re-run initialization:
```bash
npm run init
```

### Add/Remove AI Models

Edit `lib/openrouter/models.ts`:
```typescript
export const AI_MODELS: AIModelConfig[] = [
  // Add or remove models here
];
```

Re-run initialization to update traders.

## 🐛 Troubleshooting

### Cron Not Running

**Check:**
1. Vercel Dashboard → Cron Jobs → Recent Executions
2. View function logs for errors
3. Ensure environment variables are set
4. Check OpenRouter API key has credits

**Fix:**
```bash
# Manually trigger to test
curl -X POST https://your-app.vercel.app/api/cron/trade-cycle
```

### High Costs

**Reduce OpenRouter usage:**
- Decrease trade frequency (every 15-30 min)
- Use cheaper models (replace GPT-4.5 with GPT-3.5)
- Implement decision caching

### Database Errors

**Common issues:**
- Foreign key constraints → Check trader IDs
- RLS policies → Ensure service role has access
- Connection limits → Upgrade Supabase plan

### Slow Performance

**Optimize:**
- Add database indexes
- Implement caching for market data
- Use edge functions for faster response
- Optimize Supabase queries

## 📊 Monitoring Dashboard

### Supabase Queries

```sql
-- Trading activity (last 24 hours)
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(*) as trades_count,
  AVG(CAST(amount AS DECIMAL)) as avg_amount
FROM trades
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Trader performance
SELECT 
  name,
  current_balance,
  ROUND(CAST(profit_loss_percentage AS NUMERIC), 2) as profit_loss,
  total_trades
FROM ai_traders
ORDER BY profit_loss_percentage DESC;

-- System health
SELECT 
  COUNT(DISTINCT trader_id) as active_traders,
  COUNT(*) as total_trades_today,
  AVG(CAST(amount AS DECIMAL)) as avg_trade_size
FROM trades
WHERE timestamp > CURRENT_DATE;
```

### Vercel Monitoring

```bash
# Real-time logs
vercel logs --follow

# Function metrics
vercel logs /api/cron/trade-cycle

# Deployment status
vercel ls
```

### Check Cron Executions

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Cron Jobs" tab
4. View "Recent Executions"
5. Click on any execution to see logs

## 🎉 Success Checklist

Your deployment is successful when:

- ✅ Dashboard loads at your Vercel URL
- ✅ 10 AI traders visible with $250 each
- ✅ Prices update in real-time (ticker)
- ✅ First trade cycle completes after 5 minutes
- ✅ New trades appear in database
- ✅ Leaderboard updates automatically
- ✅ No errors in Vercel logs
- ✅ Cron jobs showing "Success" in Vercel dashboard
- ✅ OpenRouter charges appear (means AI is being called!)

## 🚀 You're Live!

Congratulations! Your AI trading arena is now running 24/7 in production on **Vercel only**! 🎊

**What's happening:**
- 🤖 10 AI models competing
- 💰 Each started with $250
- 📊 Trading based on live market prices
- 🔄 Decisions made every 5 minutes
- 🏆 Fighting for #1 on the leaderboard
- ⚡ All automated by Vercel cron

**Share your arena:**
```
https://your-app.vercel.app/dashboard
```

Watch the AI models battle it out in real-time! 🚀📈

## 🎯 Why Vercel Only?

**Advantages:**
- ✅ **Simpler**: One platform for everything
- ✅ **Faster**: No network latency between services
- ✅ **Cheaper**: No Railway costs (~$10-20/month saved)
- ✅ **Easier**: One dashboard to manage
- ✅ **Built-in Cron**: No extra setup needed
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Global CDN**: Fast worldwide
- ✅ **Zero config**: Just deploy and go!

**vs. Railway + Vercel:**
- ❌ More complexity
- ❌ Two services to manage
- ❌ Network latency between services
- ❌ Extra costs
- ❌ More configuration

**The verdict**: Vercel-only is simpler, faster, and cheaper! 🏆

---

**Need Help?** Check Vercel logs and Supabase database. Most issues are related to environment variables or API keys.

**Happy Trading!** 🎉✨
