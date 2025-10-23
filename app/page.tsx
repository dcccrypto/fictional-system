'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a brief animation
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-foreground mb-4"
          style={{
            backgroundImage: 'linear-gradient(135deg, #00ff88 0%, #00a8ff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
          animate={{
            backgroundImage: [
              'linear-gradient(135deg, #00ff88 0%, #00a8ff 100%)',
              'linear-gradient(135deg, #00a8ff 0%, #ff0055 100%)',
              'linear-gradient(135deg, #ff0055 0%, #00ff88 100%)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          AVAAN
        </motion.h1>
        <p className="text-xl text-foreground/70 mb-8">
          AI Trading Arena
        </p>
        <LoadingSpinner size="lg" />
      </motion.div>
    </div>
  );
}
