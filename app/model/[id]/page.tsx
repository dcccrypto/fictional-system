'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { AITrader, Trade, Portfolio } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import StatBadge from '@/components/ui/StatBadge';
import PortfolioChart from '@/components/charts/PortfolioChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { fadeIn, staggerContainer, staggerItem } from '@/components/animations/variants';
import { 
  calculateWinRate, 
  calculateSharpeRatio,
  calculateMaxDrawdown,
  formatCurrency,
  formatPercentage 
} from '@/utils/metrics';

export default function ModelProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [trader, setTrader] = useState<AITrader | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadTraderData(params.id as string);
    }
  }, [params.id]);

  async function loadTraderData(traderId: string) {
    try {
      // Load trader info
      const { data: traderData, error: traderError } = await supabase
        .from('ai_traders')
        .select('*')
        .eq('id', traderId)
        .single();

      if (traderError || !traderData) {
        console.error('Trader not found');
        router.push('/dashboard');
        return;
      }

      setTrader(traderData);

      // Load trades
      const { data: tradesData } = await supabase
        .from('trades')
        .select('*')
        .eq('trader_id', traderId)
        .order('timestamp', { ascending: false });

      if (tradesData) {
        setTrades(tradesData);
      }

      // Load portfolios
      const { data: portfoliosData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('trader_id', traderId);

      if (portfoliosData) {
        setPortfolios(portfoliosData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading trader data:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!trader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Trader not found</p>
      </div>
    );
  }

  // Calculate advanced metrics
  const winRate = calculateWinRate(trades);
  const returns = trades.slice(0, 20).map((t, i) => 
    i === 0 ? 0 : (t.price - trades[i - 1].price) / trades[i - 1].price
  );
  const sharpeRatio = calculateSharpeRatio(returns);

  // Generate balance history for chart
  const balanceHistory = generateBalanceHistory(trader, trades);
  const maxDrawdown = calculateMaxDrawdown(balanceHistory.map(b => b.balance));

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <AnimatedButton onClick={() => router.push('/dashboard')} variant="ghost">
            ← Back to Leaderboard
          </AnimatedButton>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <GlassCard>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {trader.name}
                </h1>
                <p className="text-foreground/70 mb-4">
                  {trader.personality}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <StatBadge value={trader.profit_loss_percentage} size="lg" />
                  {trader.status === 'liquidated' && (
                    <div className="px-4 py-2 rounded-full bg-loss/20 text-loss text-sm font-bold">
                      LIQUIDATED
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-foreground/60 text-sm">Current Balance</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(trader.current_balance)}
                </p>
                <p className="text-foreground/60 text-sm mt-2">
                  Started with {formatCurrency(trader.initial_balance)}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Advanced Metrics */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            📊 Advanced Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard>
              <p className="text-foreground/60 text-sm mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-foreground">{winRate.toFixed(1)}%</p>
            </GlassCard>
            <GlassCard>
              <p className="text-foreground/60 text-sm mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-foreground">{sharpeRatio.toFixed(2)}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-foreground/60 text-sm mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-loss">{maxDrawdown.toFixed(2)}%</p>
            </GlassCard>
            <GlassCard>
              <p className="text-foreground/60 text-sm mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-foreground">{trader.total_trades}</p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Portfolio Chart */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            💹 Portfolio Performance
          </h2>
          <GlassCard>
            <PortfolioChart data={balanceHistory} />
          </GlassCard>
        </motion.div>

        {/* Current Holdings */}
        {portfolios.length > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              💼 Current Holdings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {portfolios.map((portfolio) => (
                <GlassCard key={portfolio.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{portfolio.asset}</p>
                      <p className="text-sm text-foreground/60">
                        {portfolio.quantity.toFixed(4)} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground/60 text-sm">Avg Price</p>
                      <p className="font-bold text-foreground">
                        {formatCurrency(portfolio.average_buy_price)}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trade History */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            📜 Trade History
          </h2>
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Asset</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.slice(0, 20).map((trade) => (
                    <motion.tr
                      key={trade.id}
                      className="border-b border-glass-border/50 hover:bg-glass-light/50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="py-3 px-4 text-foreground/80 text-sm">
                        {new Date(trade.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`
                          px-2 py-1 rounded text-xs font-bold uppercase
                          ${trade.action === 'buy' ? 'bg-profit/20 text-profit' : ''}
                          ${trade.action === 'sell' ? 'bg-loss/20 text-loss' : ''}
                          ${trade.action === 'hold' ? 'bg-foreground/20 text-foreground' : ''}
                        `}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground font-bold">{trade.asset}</td>
                      <td className="py-3 px-4 text-foreground">{trade.amount.toFixed(4)}</td>
                      <td className="py-3 px-4 text-foreground">{formatCurrency(trade.price)}</td>
                      <td className="py-3 px-4 text-foreground/70 text-sm max-w-xs truncate">
                        {trade.reasoning}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {trades.length === 0 && (
                <p className="text-center text-foreground/60 py-8">No trades yet</p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// Helper function to generate balance history
function generateBalanceHistory(trader: AITrader, trades: Trade[]): { timestamp: string; balance: number }[] {
  const history: { timestamp: string; balance: number }[] = [];
  let currentBalance = trader.initial_balance;

  // Start with initial balance
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14); // 14 days ago
  history.push({
    timestamp: startDate.toISOString(),
    balance: currentBalance
  });

  // Process trades in chronological order
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const trade of sortedTrades) {
    if (trade.action === 'buy') {
      currentBalance -= trade.amount * trade.price;
    } else if (trade.action === 'sell') {
      currentBalance += trade.amount * trade.price;
    }

    history.push({
      timestamp: trade.timestamp,
      balance: currentBalance
    });
  }

  return history;
}


