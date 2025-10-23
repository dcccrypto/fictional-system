# ⚡ Ultra-Simple Deployment Guide

Deploy your entire AI trading arena with **just 3 commands**!

## 🎯 What You Need

- ✅ Supabase account (database)
- ✅ OpenRouter API key (AI models)
- ✅ Vercel account (hosting)

**That's it!** No Railway, no complex setup, just 3 services.

## 🚀 Deploy in 3 Steps

### Step 1: Set Up Database (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to SQL Editor → Paste contents of `supabase-schema.sql` → Run
3. Go to Settings → API → Copy your keys

### Step 2: Deploy to Vercel (2 minutes)

```bash
# Install CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_APP_URL`

### Step 3: Initialize Traders (1 minute)

```bash
npm run init
```

## ✅ Done!

Your AI trading arena is now live at `https://your-app.vercel.app/dashboard`

**What's happening automatically:**
- 🤖 10 AI models competing
- 💰 Each with $250 starting balance
- 📊 Trading every 5 minutes
- 🔄 Real-time updates
- 🏆 Leaderboard rankings

All handled by Vercel's built-in cron jobs!

## 🎮 How It Works

```
YOU DEPLOY → Vercel hosts everything
              ↓
         Vercel Cron runs every 5 min
              ↓
         Calls /api/cron/trade-cycle
              ↓
         AI models make decisions via OpenRouter
              ↓
         Trades executed in Supabase
              ↓
         Dashboard updates in real-time
```

## 💰 Total Cost

- **OpenRouter**: ~$1,200-2,000/month (AI calls)
- **Supabase**: Free or $25/month
- **Vercel**: Free or $20/month

**Total**: ~$1,200-2,045/month

## 🎯 Why This Is Better

**Old way (Railway + Vercel):**
- ❌ 4 services to manage
- ❌ Complex configuration
- ❌ More expensive
- ❌ Network latency between services

**New way (Vercel only):**
- ✅ 3 services total
- ✅ Zero extra configuration
- ✅ $10-20/month cheaper
- ✅ Faster (no latency)
- ✅ Simpler to manage

## 🐛 Troubleshooting

**Cron not running?**
1. Go to Vercel Dashboard → Cron Jobs
2. Check "Recent Executions"
3. View logs for errors

**No trades appearing?**
1. Check environment variables are set
2. Run `npm run trade-cycle` locally to test
3. Check OpenRouter API key has credits

**Dashboard not updating?**
1. Check Supabase realtime is enabled
2. Verify service role key is correct
3. Check browser console for errors

## 🎉 You're Live!

Visit your dashboard and watch 10 AI models compete in real-time:
```
https://your-app.vercel.app/dashboard
```

The AI models don't know it's a simulation - they think they're trading real money! 🤖💰

---

**Need more details?** Check:
- `DEPLOYMENT.md` - Full deployment guide
- `QUICKSTART.md` - 5-minute setup
- `README.md` - Project overview

