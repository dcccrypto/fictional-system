'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { subscribeToTrades } from '@/lib/supabase/realtime';
import { Trade, AITrader } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fadeIn, slideIn } from '@/components/animations/variants';
import { formatCurrency } from '@/utils/metrics';

export default function ExplorerPage() {
  const router = useRouter();
  const [trades, setTrades] = useState<(Trade & { trader?: AITrader })[]>([]);
  const [traders, setTraders] = useState<AITrader[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAsset, setFilterAsset] = useState<string>('all');
  const [filterTrader, setFilterTrader] = useState<string>('all');

  useEffect(() => {
    loadData();

    // Subscribe to new trades
    const unsubscribe = subscribeToTrades((payload) => {
      loadTrades();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function loadData() {
    await Promise.all([loadTrades(), loadTraders()]);
    setLoading(false);
  }

  async function loadTrades() {
    let query = supabase
      .from('trades')
      .select(`
        *,
        trader:ai_traders(*)
      `)
      .order('timestamp', { ascending: false })
      .limit(100);

    const { data, error } = await query;

    if (data && !error) {
      // Flatten the trader object
      const formattedData = data.map(trade => ({
        ...trade,
        trader: Array.isArray(trade.trader) ? trade.trader[0] : trade.trader
      }));
      setTrades(formattedData);
    }
  }

  async function loadTraders() {
    const { data, error } = await supabase
      .from('ai_traders')
      .select('*')
      .order('name');

    if (data && !error) {
      setTraders(data);
    }
  }

  // Filter trades
  const filteredTrades = trades.filter(trade => {
    if (filterAsset !== 'all' && trade.asset !== filterAsset) return false;
    if (filterTrader !== 'all' && trade.trader_id !== filterTrader) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <AnimatedButton onClick={() => router.push('/dashboard')} variant="ghost" className="mb-4">
            ← Back to Dashboard
          </AnimatedButton>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            🔍 Trade Explorer
          </h1>
          <p className="text-foreground/70 text-lg">
            Real-time blockchain-style trade log
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard>
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-foreground/80 text-sm mb-2">Filter by Asset</label>
                <select
                    value={filterAsset}
                    onChange={(e) => setFilterAsset(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/80 border border-glass-border text-foreground focus:outline-none focus:border-accent"
                  >
                  <option value="all">All Assets</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground/80 text-sm mb-2">Filter by Trader</label>
                <select
                    value={filterTrader}
                    onChange={(e) => setFilterTrader(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white/80 border border-glass-border text-foreground focus:outline-none focus:border-accent"
                  >
                  <option value="all">All Traders</option>
                  {traders.map(trader => (
                    <option key={trader.id} value={trader.id}>{trader.name}</option>
                  ))}
                </select>
              </div>

              {(filterAsset !== 'all' || filterTrader !== 'all') && (
                <div className="flex items-end">
                  <AnimatedButton
                    variant="ghost"
                    onClick={() => {
                      setFilterAsset('all');
                      setFilterTrader('all');
                    }}
                  >
                    Clear Filters
                  </AnimatedButton>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <GlassCard>
            <p className="text-foreground/60 text-sm mb-1">Total Trades</p>
            <p className="text-2xl font-bold text-foreground">{filteredTrades.length}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-foreground/60 text-sm mb-1">Buy Trades</p>
            <p className="text-2xl font-bold text-profit">
              {filteredTrades.filter(t => t.action === 'buy').length}
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-foreground/60 text-sm mb-1">Sell Trades</p>
            <p className="text-2xl font-bold text-loss">
              {filteredTrades.filter(t => t.action === 'sell').length}
            </p>
          </GlassCard>
        </motion.div>

        {/* Trade List */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">TX Hash</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Trader</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Asset</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Slippage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade, index) => (
                    <motion.tr
                      key={trade.id}
                      className="border-b border-glass-border/50 hover:bg-glass-light/50 transition-colors cursor-pointer"
                      variants={slideIn}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.02 }}
                      onClick={() => trade.trader && router.push(`/model/${trade.trader_id}`)}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-profit">
                        {trade.transaction_hash.substring(0, 10)}...
                        {trade.transaction_hash.substring(trade.transaction_hash.length - 8)}
                      </td>
                      <td className="py-3 px-4 text-foreground/80 text-sm">
                        {new Date(trade.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {trade.trader?.name || 'Unknown'}
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
                      <td className="py-3 px-4 text-foreground/60 text-sm">
                        {trade.slippage > 0 ? `$${trade.slippage.toFixed(2)}` : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredTrades.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-foreground/60">No trades found</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}


