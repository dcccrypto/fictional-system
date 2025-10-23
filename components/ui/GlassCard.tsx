'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cardHover } from '@/components/animations/variants';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: GlassCardProps) {
  const classes = `glass-card p-6 ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={classes}
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}


