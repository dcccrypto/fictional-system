'use client';

import { motion } from 'framer-motion';

interface StatBadgeProps {
  value: number;
  isPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatBadge({ 
  value, 
  isPercentage = true,
  size = 'md',
  className = '' 
}: StatBadgeProps) {
  const isPositive = value >= 0;
  
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1 rounded-full font-bold
        ${isPositive ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}
        ${sizes[size]}
        ${className}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isPositive ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      <span>
        {isPositive ? '+' : ''}
        {value.toFixed(2)}
        {isPercentage ? '%' : ''}
      </span>
    </motion.div>
  );
}


