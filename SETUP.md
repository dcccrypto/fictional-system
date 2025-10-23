# 🚀 Avaan Trading Arena - Complete Setup Guide

This guide will walk you through setting up Avaan Trading Arena from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Node.js 18+ installed ([Download](https://nodejs.org))
- ✅ A Supabase account ([Sign up](https://supabase.com))
- ✅ An OpenRouter API key ([Get one](https://openrouter.ai))
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## Step 1: Project Setup

### Clone and Install Dependencies

```bash
# Navigate to your projects directory
cd ~/Desktop

# The project is already created
cd avaan

# Install dependencies (if not already done)
npm install
```

## Step 2: Supabase Configuration

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Name**: avaan-trading
   - **Database Password**: (create a strong password)
   - **Region**: (choose closest to you)
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### Set Up the Database Schema

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` in this project
4. Copy all contents
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. Wait for "Success. No rows returned" message

You should see:
- ✅ 4 tables created (ai_traders, trades, portfolios, market_snapshots)
- ✅ Indexes created
- ✅ RLS policies enabled
- ✅ Real-time subscriptions enabled

### Get Your Supabase Keys

1. Click **Settings** (gear icon) in left sidebar
2. Click **API** under Project Settings
3. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (click "Reveal" first)

## Step 3: OpenRouter API Key

### Get Your OpenRouter Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign in with Google/GitHub
3. Click your profile → **Keys**
4. Click **Create Key**
5. Name it "Avaan Trading Arena"
6. Copy the key (starts with `sk-or-v1-...`)

### Add Credits (Optional)

OpenRouter requires credits for API usage:
1. Click **Credits** in the sidebar
2. Add $5-10 to start (each trading cycle costs ~$0.10-0.20)

## Step 4: Environment Variables

### Configure .env.local

1. Open `.env.local` in your code editor
2. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxx...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Save the file

⚠️ **IMPORTANT**: Never commit `.env.local` to Git!

## Step 5: Seed the Database

### Generate Historical Data

Run the seed script to create 10 AI traders and 14 days of trading history:

```bash
npm run seed
```

You should see output like:
```
🤖 Creating AI traders...
✅ Created 10 traders
📜 Generating trade history...

  Orion the Oracle: 142 trades, P/L: 23.45%
  Opus the Optimizer: 89 trades, P/L: 12.34%
  Gemini the Genius: 167 trades, P/L: -8.23%
  ...

✅ Trade history generated successfully!
🎉 Database seeded successfully!
```

### Verify in Supabase

1. Go to your Supabase project
2. Click **Table Editor**
3. Check these tables:
   - **ai_traders**: Should have 10 rows
   - **trades**: Should have 1000+ rows
   - **portfolios**: Should have multiple rows

## Step 6: Run the Development Server

### Start the App

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Open the App

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see:
   - Animated "AVAAN" logo for 1.5 seconds
   - Redirect to `/dashboard`
   - Live leaderboard with 10 AI traders
   - Price ticker at the top
   - Glass morphism cards

### Test the Pages

- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **AI Profile**: Click any trader to see their profile
- **Explorer**: Click "Explorer" card or go to [http://localhost:3000/explorer](http://localhost:3000/explorer)

## Step 7: Test Trading Cycle

### Manual Trading Cycle

In a new terminal (keep `npm run dev` running):

```bash
npm run trade-cycle
```

You should see a JSON response with:
- ✅ `success: true`
- Market data (BTC, ETH, SOL prices)
- Trading results for each AI

### Watch Real-Time Updates

1. Keep the dashboard open in your browser
2. Run `npm run trade-cycle` again
3. Watch the leaderboard update in real-time
4. Check the Explorer page to see new trades appear

## Step 8: Deploy to Vercel

### Push to GitHub

```bash
git add .
git commit -m "Initial Avaan Trading Arena setup"
git remote add origin https://github.com/yourusername/avaan.git
git push -u origin main
```

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
5. Add Environment Variables:
   - Click **Environment Variables**
   - Add all variables from `.env.local`
   - Set them for Production, Preview, and Development
6. Click **Deploy**
7. Wait 2-3 minutes

### Verify Deployment

1. Click the generated URL (e.g., `avaan.vercel.app`)
2. The app should load with all data
3. Check that real-time updates work

### Enable Cron Job

The `vercel.json` file already configures the cron. Verify:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Cron Jobs**
3. You should see:
   - Path: `/api/cron/trade-cycle`
   - Schedule: `*/5 * * * *` (every 5 minutes)

If not visible, manually add it:
1. Click **Add Cron**
2. Path: `/api/cron/trade-cycle`
3. Schedule: `*/5 * * * *`

## 🎉 You're Done!

Your Avaan Trading Arena is now live! The AI traders will make decisions every 5 minutes automatically.

## 🧪 Testing Checklist

- [ ] Dashboard loads with 10 traders
- [ ] Live price ticker shows BTC, ETH, SOL
- [ ] Clicking a trader shows their profile
- [ ] Explorer shows all trades
- [ ] Real-time updates work (run manual trade cycle)
- [ ] Glass morphism design looks good
- [ ] Mobile responsive design works
- [ ] Cron job runs every 5 minutes

## 📊 Monitoring

### Check Cron Job Logs

1. In Vercel, go to **Deployments**
2. Click on the latest deployment
3. Click **Functions** tab
4. Find `/api/cron/trade-cycle`
5. View logs to see trading activity

### Supabase Logs

1. In Supabase, click **Logs**
2. Filter by table (e.g., trades)
3. See real-time database activity

## 🐛 Troubleshooting

### "No active traders" error

- Run `npm run seed` again
- Check Supabase `ai_traders` table has data

### "OPENROUTER_API_KEY not configured"

- Verify `.env.local` has the key
- In Vercel, check Environment Variables
- Restart dev server or redeploy

### Real-time updates not working

- Check Supabase **API Settings** → **Realtime** is enabled
- Verify RLS policies are set correctly
- Check browser console for WebSocket errors

### Prices not loading

- Hyperliquid API might be rate-limited
- Check fallback prices in `lib/hyperliquid/client.ts`
- Network requests should work (check browser Network tab)

### Cron not running

- Verify `vercel.json` exists
- Check Vercel Cron Jobs settings
- View function logs for errors
- Ensure Production deployment (crons don't run on Preview)

## 🚀 Next Steps

- Customize AI personalities in `lib/openrouter/models.ts`
- Add more cryptocurrencies
- Integrate real news API
- Customize the design theme
- Add social features
- Build a mobile app

## 💡 Pro Tips

1. **API Costs**: Monitor OpenRouter usage to avoid surprises
2. **Database Size**: Archive old trades monthly to keep DB small
3. **Performance**: Use Vercel Analytics to monitor page speed
4. **SEO**: Add meta tags for social sharing
5. **Backup**: Export Supabase data regularly

---

Need help? Check the main README.md or open an issue on GitHub!


