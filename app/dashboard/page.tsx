'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getCurrentPrices } from '@/lib/hyperliquid/client';
import { subscribeToTrades } from '@/lib/supabase/realtime';
import { AITrader, MarketData, Trade } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import PriceTicker from '@/components/ui/PriceTicker';
import StatBadge from '@/components/ui/StatBadge';
import MiniChart from '@/components/charts/MiniChart';
import ModelsComparisonChart from '@/components/charts/ModelsComparisonChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { staggerContainer, staggerItem, fadeIn } from '@/components/animations/variants';
import { formatCurrency } from '@/utils/metrics';

export default function DashboardPage() {
  const [traders, setTraders] = useState<AITrader[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [trades, setTrades] = useState<(Trade & { trader?: AITrader })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time trades
    const unsubscribe = subscribeToTrades(() => {
      loadTraders();
      loadTrades();
    });

    // Refresh market data every 30 seconds
    const intervalId = setInterval(() => {
      loadMarketData();
    }, 30000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  async function loadData() {
    await Promise.all([loadTraders(), loadMarketData(), loadTrades()]);
    setLoading(false);
  }

  async function loadTraders() {
    const { data, error } = await supabase
      .from('ai_traders')
      .select('*')
      .order('profit_loss_percentage', { ascending: false });

    if (data && !error) {
      setTraders(data);
    }
  }

  async function loadMarketData() {
    try {
      const data = await getCurrentPrices();
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }

  async function loadTrades() {
    const { data, error } = await supabase
      .from('trades')
      .select(`
        *,
        trader:ai_traders(*)
      `)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (data && !error) {
      const formattedData = data.map(trade => ({
        ...trade,
        trader: Array.isArray(trade.trader) ? trade.trader[0] : trade.trader
      }));
      setTrades(formattedData);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Failed to load market data</p>
      </div>
    );
  }

  const totalPortfolioValue = traders.reduce((sum, t) => sum + t.current_balance, 0);
  const totalTrades = traders.reduce((sum, t) => sum + t.total_trades, 0);
  const avgProfitLoss = traders.reduce((sum, t) => sum + t.profit_loss_percentage, 0) / traders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50">
      {/* Price Ticker */}
      <PriceTicker marketData={marketData} />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            AVAAN Trading Arena
          </h1>
          <p className="text-foreground/60">
            AI-Powered Cryptocurrency Trading Competition
          </p>
        </div>

        {/* Stats Overview */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={staggerItem}>
            <GlassCard className="p-4 relative">
              <div className="relative z-10">
                <p className="text-sm text-foreground/60 mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalPortfolioValue)}
                </p>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={staggerItem}>
            <GlassCard className="p-4 relative">
              <div className="relative z-10">
                <p className="text-sm text-foreground/60 mb-1">Total Trades</p>
                <p className="text-2xl font-bold text-accent">{totalTrades}</p>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={staggerItem}>
            <GlassCard className="p-4 relative">
              <div className="relative z-10">
                <p className="text-sm text-foreground/60 mb-1">Average P/L</p>
                <p className={`text-2xl font-bold ${avgProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {avgProfitLoss >= 0 ? '+' : ''}{avgProfitLoss.toFixed(2)}%
                </p>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={staggerItem}>
            <GlassCard className="p-4 relative">
              <div className="relative z-10">
                <p className="text-sm text-foreground/60 mb-1">Active Traders</p>
                <p className="text-2xl font-bold text-foreground">
                  {traders.filter(t => t.status === 'active').length}/10
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Models Performance Chart */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <GlassCard className="p-6 relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      AI Models Performance
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-profit"></div>
                        <span>Profit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-loss"></div>
                        <span>Loss</span>
                      </div>
                    </div>
                  </div>
                  <ModelsComparisonChart traders={traders} />
                </div>
              </GlassCard>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6 relative">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Leaderboard
                  </h2>

                <div className="space-y-3">
                  {traders.map((trader, index) => (
                    <Link key={trader.id} href={`/model/${trader.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-glass-light/50 transition-all cursor-pointer group"
                      >
                        {/* Rank */}
                        <div className={`
                          text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${index === 0 ? 'bg-profit/20 text-profit' : ''}
                          ${index === 1 ? 'bg-accent/20 text-accent' : ''}
                          ${index === 2 ? 'bg-orange-500/20 text-orange-400' : ''}
                          ${index > 2 ? 'bg-foreground/10 text-foreground/60' : ''}
                        `}>
                          {index + 1}
                        </div>

                        {/* Name & Trades */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                            {trader.name}
                          </h3>
                          <p className="text-sm text-foreground/60">
                            {trader.total_trades} trades
                          </p>
                        </div>

                        {/* Mini Chart */}
                        <div className="hidden md:block">
                          <MiniChart
                            data={generateMockChartData(trader.profit_loss_percentage)}
                            color={trader.profit_loss_percentage >= 0 ? '#00ff88' : '#ff0055'}
                          />
                        </div>

                        {/* Balance */}
                        <div className="text-right">
                          <p className="text-sm text-foreground/60">Balance</p>
                          <p className="font-bold text-foreground">
                            ${trader.current_balance.toFixed(2)}
                          </p>
                        </div>

                        {/* P/L Badge */}
                        <div className="flex items-center gap-2">
                          <StatBadge value={trader.profit_loss_percentage} size="sm" />
                        </div>

                        {/* Status */}
                        {trader.status === 'liquidated' && (
                          <div className="px-2 py-1 rounded bg-loss/20 text-loss text-xs font-bold">
                            LIQUIDATED
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column - Recent Trades Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="sticky top-6"
            >
              <div className="glass-card p-6 relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Recent Trades</h2>
                    <div className="px-2 py-1 rounded-full bg-profit/10 text-profit text-xs font-bold">LIVE</div>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                    {trades.slice(0, 10).map((trade, index) => (
                      <div key={trade.id} className="glass-card p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{trade.trader?.name || 'Unknown'}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.action === 'buy' ? 'bg-profit/10 text-profit' : 
                            trade.action === 'sell' ? 'bg-loss/10 text-loss' : 'bg-foreground/10 text-foreground/70'
                          }`}>
                            {trade.action.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-foreground/60">Asset:</span>
                            <span className="ml-2 font-medium">{trade.asset}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60">Amount:</span>
                            <span className="ml-2 font-medium">{formatCurrency(trade.amount)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-foreground/40 text-xs mt-8"
        >
          <p>Trading cycles run every 5 minutes • AI-powered trading competition</p>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function
function generateMockChartData(profitLoss: number): { value: number }[] {
  const baseValue = 250;
  const currentValue = baseValue * (1 + profitLoss / 100);
  const dataPoints = 10;
  const data: { value: number }[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const progress = i / (dataPoints - 1);
    const value = baseValue + (currentValue - baseValue) * progress;
    const noise = (Math.random() - 0.5) * 10;
    data.push({ value: value + noise });
  }

  return data;
}
