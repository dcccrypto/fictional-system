'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PriceDisplayProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  showChange?: boolean;
}

export default function PriceDisplay({
  value,
  prefix = '$',
  suffix = '',
  decimals = 2,
  className = '',
  showChange = false
}: PriceDisplayProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [changeDirection, setChangeDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  const spring = useSpring(value, { 
    stiffness: 100, 
    damping: 30,
    mass: 0.5
  });
  
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
    
    if (showChange) {
      if (value > prevValue) {
        setChangeDirection('up');
      } else if (value < prevValue) {
        setChangeDirection('down');
      } else {
        setChangeDirection('neutral');
      }
      
      setPrevValue(value);
      
      // Reset change direction after animation
      const timeout = setTimeout(() => {
        setChangeDirection('neutral');
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [value, spring, showChange, prevValue]);

  const colorClasses = showChange
    ? changeDirection === 'up'
      ? 'text-profit'
      : changeDirection === 'down'
      ? 'text-loss'
      : ''
    : '';

  return (
    <motion.span
      className={`font-mono tabular-nums ${colorClasses} ${className}`}
      animate={showChange ? {
        scale: changeDirection !== 'neutral' ? [1, 1.1, 1] : 1
      } : undefined}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  );
}


