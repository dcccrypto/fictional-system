import { supabase } from './client';
import { Trade, AITrader } from '@/types';

export const subscribeToTrades = (
  callback: (payload: { new: Trade }) => void
) => {
  const channel = supabase
    .channel('trades')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'trades'
      },
      (payload) => {
        callback(payload as { new: Trade });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToTraderUpdates = (
  callback: (payload: { new: AITrader; old: AITrader }) => void
) => {
  const channel = supabase
    .channel('ai_traders')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'ai_traders'
      },
      (payload) => {
        callback(payload as { new: AITrader; old: AITrader });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToMarketSnapshots = (
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel('market_snapshots')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'market_snapshots'
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};


