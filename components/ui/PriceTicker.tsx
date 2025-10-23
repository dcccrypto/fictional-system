'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MarketData } from '@/types';
import PriceDisplay from './PriceDisplay';

interface PriceTickerProps {
  marketData: MarketData;
}

export default function PriceTicker({ marketData }: PriceTickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', data: marketData.BTC },
    { symbol: 'ETH', name: 'Ethereum', data: marketData.ETH },
    { symbol: 'SOL', name: 'Solana', data: marketData.SOL }
  ];

  return (
    <div className="w-full glass-card !rounded-none border-l-0 border-r-0 border-t-0 overflow-hidden relative z-10">
      <motion.div
        className="flex gap-8 py-4 px-6 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center gap-3 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{asset.symbol}</span>
              <span className="text-xs text-foreground/60">{asset.name}</span>
            </div>
            <PriceDisplay 
              value={asset.data.price} 
              decimals={asset.symbol === 'BTC' ? 2 : 2}
              className="text-lg font-bold"
              showChange={true}
            />
            <motion.span
              className={`text-sm font-medium ${
                asset.data.change_24h >= 0 ? 'text-profit' : 'text-loss'
              }`}
              animate={{
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {asset.data.change_24h >= 0 ? '+' : ''}
              {asset.data.change_24h.toFixed(2)}%
            </motion.span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}


