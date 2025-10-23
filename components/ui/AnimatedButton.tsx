'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { buttonPress } from '@/components/animations/variants';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false
}: AnimatedButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-profit text-cosmic-dark hover:bg-profit/90',
    secondary: 'bg-glass-light text-foreground border border-glass-border hover:border-accent',
    ghost: 'text-foreground hover:bg-glass-light'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`;

  const handleClick = () => {
    if (!disabled && onClick) {
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick();
    }
  };

  return (
    <motion.button
      className={classes}
      variants={buttonPress}
      initial="rest"
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'pressed'}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}


