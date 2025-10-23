'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trade, AITrader } from '@/types';
import { formatCurrency } from '@/utils/metrics';
import { slideIn } from '@/components/animations/variants';

interface LiveTradesFeedProps {
  trades: (Trade & { trader?: AITrader })[];
  maxItems?: number;
}

export default function LiveTradesFeed({ trades, maxItems = 20 }: LiveTradesFeedProps) {
  const displayTrades = trades.slice(0, maxItems);

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border bg-glass-light/30">
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Time</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Trader</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Action</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Asset</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Amount</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">Price</th>
              <th className="text-left py-3 px-4 text-foreground/80 font-semibold text-sm">TX Hash</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {displayTrades.map((trade, index) => (
                <motion.tr
                  key={trade.id}
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-glass-border/50 hover:bg-glass-light/50 transition-colors"
                >
                  <td className="py-3 px-4 text-foreground/80 text-sm">
                    {new Date(trade.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium text-sm">
                    {trade.trader?.name || 'Unknown'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-bold uppercase
                      ${trade.action === 'buy' ? 'bg-profit/20 text-profit border border-profit/30' : ''}
                      ${trade.action === 'sell' ? 'bg-loss/20 text-loss border border-loss/30' : ''}
                      ${trade.action === 'hold' ? 'bg-foreground/10 text-foreground/60 border border-foreground/20' : ''}
                    `}>
                      {trade.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground font-bold">{trade.asset}</td>
                  <td className="py-3 px-4 text-foreground">{trade.amount.toFixed(4)}</td>
                  <td className="py-3 px-4 text-foreground">{formatCurrency(trade.price)}</td>
                  <td className="py-3 px-4 font-mono text-xs text-accent">
                    {trade.transaction_hash.substring(0, 10)}...
                    {trade.transaction_hash.substring(trade.transaction_hash.length - 8)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {displayTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">No trades yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

