# 🚀 Avaan Trading Arena

A **100% live** cryptocurrency trading simulation where 10 cutting-edge AI models compete in real-time. Watch GPT-4.5, Claude 4.5, Gemini 2.5, DeepSeek, and other leading AI models make real trading decisions every 5 minutes based on live market prices. The AI models don't know it's a simulation - they think they're trading with real money!

## ✨ Features

- **10 AI Traders**: Each powered by different state-of-the-art language models with unique personalities
- **Live Trading System**: AI models make real trading decisions every 5 minutes via OpenRouter
- **Live Market Data**: Real cryptocurrency prices from Hyperliquid & CoinGecko APIs
- **Real-Time Updates**: Supabase real-time subscriptions for live leaderboard and trade notifications
- **Beautiful UI**: Liquid glass morphism design with smooth animations and futuristic aesthetics
- **Advanced Metrics**: Sharpe ratio, max drawdown, win rate, and more
- **Blockchain-Style Explorer**: Transparent trade logs with transaction hashes
- **Automated Trading**: Vercel cron jobs run trading cycles automatically in production
- **Fully Responsive**: Optimized for mobile and desktop

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **AI Models**: OpenRouter API (GPT-4.5, Claude 4.5, Gemini 2.5, DeepSeek, Qwen)
- **Market Data**: Hyperliquid + CoinGecko APIs
- **Charts**: Recharts
- **Deployment**: Vercel only (frontend + API + cron jobs - all in one!)

**Just 3 services needed: Supabase + OpenRouter + Vercel. That's it!**

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenRouter API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd avaan
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the contents of `supabase-schema.sql`
   - Get your project URL and keys from Settings > API

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the trading system**
   ```bash
   npm run init
   ```
   
   This will:
   - Create the 10 AI traders with unique personalities
   - Give each trader $250 starting balance
   - Set everything to active status
   - **NO fake history** - everything starts fresh!

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

6. **Start live trading** (in a separate terminal)
   ```bash
   npm run start-live
   ```
   
   This runs trading cycles every 5 minutes where AI models make **real decisions with live prices**!
   
   The AI models don't know it's a simulation - they think they're trading real money! 🤖💰

## 🤖 The AI Traders

1. **Orion the Oracle** (GPT-5) - Superior reasoning with strategic long-term positions
2. **Opus the Optimizer** (Claude 4.5) - Meticulous analyst focused on risk-adjusted returns
3. **Gemini the Genius** (Gemini 2.5 Pro) - Multimodal powerhouse with bold moves
4. **DeepSeek the Detective** (DeepSeek R1) - Evidence-based trading expert
5. **Qwen the Quantitative** (Qwen2.5-Max) - Algorithmic approach specialist
6. **Turbo the Tactician** (GPT-4 Turbo) - Reliable balanced trader
7. **Claude the Cautious** (Claude 4 Opus) - Safety-focused risk manager
8. **Gemini the Gambler** (Gemini 2.0 Pro) - Aggressive high-frequency speculator
9. **Deep the Daring** (DeepSeek V3) - All-in high-conviction plays
10. **Qwen the Quick** (Qwen2.5-Coder) - Technical pattern trading specialist

## 🔄 Live Trading System

The platform runs **continuous trading cycles every 5 minutes** where each AI:

1. Fetches live market data from Hyperliquid & CoinGecko (BTC, ETH, SOL)
2. Reviews their current portfolio and balance
3. Makes a real trading decision via OpenRouter API
4. Executes the trade with realistic slippage (0.1-0.5%)
5. Updates the leaderboard and triggers real-time UI updates

### Local Development

**Continuous Trading** (runs every 5 minutes):
```bash
npm run start-live
```

**Single Cycle** (test one trade cycle):
```bash
npm run trade-cycle
```

### Production (Vercel Only!)

Everything runs on Vercel - no Railway or other services needed!

```bash
vercel --prod
```

Vercel automatically handles:
- ✅ Frontend hosting
- ✅ API routes (serverless functions)
- ✅ Cron jobs (runs `/api/cron/trade-cycle` every 5 minutes)
- ✅ Real AI trading decisions via OpenRouter
- ✅ Database updates and real-time triggers
- ✅ Zero additional configuration!

**Check it's working**: Vercel Dashboard → Your Project → Cron Jobs

**Why Vercel only?** Simpler, faster, and cheaper than using multiple platforms!

## 📊 Database Schema

- **ai_traders**: The 10 AI models with balances and stats
- **trades**: All trading activity with transaction hashes
- **portfolios**: Current cryptocurrency holdings
- **market_snapshots**: Historical price data

See `supabase-schema.sql` for the complete schema.

## 🎨 Design Philosophy

Avaan features a "liquid glass" aesthetic inspired by Apple's design language:

- **Cosmic Gradient Background**: Deep blues and purples
- **Frosted Glass Cards**: Semi-transparent panels with backdrop blur
- **Smooth Animations**: Framer Motion for buttery transitions
- **Responsive Design**: Mobile-first approach
- **Profit/Loss Colors**: Green (#00ff88) for gains, Red (#ff0055) for losses

## 📱 Pages

- **/** - Landing page with animated logo
- **/dashboard** - Main leaderboard with live rankings
- **/model/[id]** - Individual AI trader profile with detailed analytics
- **/explorer** - Blockchain-style transaction explorer

## 🔧 API Routes

- **GET /api/cron/trade-cycle** - Executes one trading cycle (5-min cron)

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/avaan)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Set up Cron job (see above)

### Environment Variables in Vercel

Add all variables from `.env.local` to your Vercel project settings.

## 🧪 Development

### Project Structure

```
avaan/
├── app/                    # Next.js app router pages
│   ├── dashboard/          # Main leaderboard
│   ├── model/[id]/         # AI trader profiles
│   ├── explorer/           # Trade explorer
│   └── api/cron/           # API routes
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── charts/             # Chart components
│   └── animations/         # Framer Motion variants
├── lib/                    # Core libraries
│   ├── supabase/           # Database client
│   ├── hyperliquid/        # Market data API
│   ├── openrouter/         # AI integration
│   └── trading/            # Trading engine
├── types/                  # TypeScript types
├── utils/                  # Helper functions
└── scripts/                # Seed and utility scripts
```

### Key Files

- `lib/trading/engine.ts` - Core trading logic
- `lib/openrouter/trader.ts` - AI decision-making
- `app/api/cron/trade-cycle/route.ts` - Automated trading cycle
- `components/ui/GlassCard.tsx` - Main UI component
- `scripts/seed-history.ts` - Database seeding

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use Supabase Row Level Security (RLS) policies
- OpenRouter API key should be server-side only
- Service role key is for API routes only

## 📈 Future Enhancements

- [ ] Real news integration (CoinGecko/CryptoCompare)
- [ ] More cryptocurrencies (XRP, ADA, AVAX, etc.)
- [ ] User accounts and watchlists
- [ ] Social features (comments, reactions)
- [ ] Advanced charting (TradingView integration)
- [ ] Mobile app (React Native)
- [ ] AI model comparison tools
- [ ] Historical replay mode

## 📝 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 🙏 Acknowledgments

- OpenRouter for AI model access
- Hyperliquid for market data
- Supabase for the amazing database platform
- Vercel for seamless deployment

---

Built with ❤️ for the AI and crypto communities
