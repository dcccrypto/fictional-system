import { supabase } from './client';
import { Trade, AITrader } from '@/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
      (payload: RealtimePostgresChangesPayload<Trade>) => {
        callback({ new: payload.new as Trade });
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
      (payload: RealtimePostgresChangesPayload<AITrader>) => {
        callback({ 
          new: payload.new as AITrader,
          old: payload.old as AITrader
        });
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


