import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { getCurrentPrices } from '@/lib/hyperliquid/client';
import { getTradingDecision } from '@/lib/openrouter/trader';
import { getModelByModelName } from '@/lib/openrouter/models';
import { executeTrade, updateLeaderboard, shouldPanicSell } from '@/lib/trading/engine';
import { AITrader, Portfolio } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

/**
 * Trade Cycle Cron Job
 * Runs every 5 minutes to execute AI trading decisions
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting trade cycle...');

    // 1. Fetch current market prices
    const marketData = await getCurrentPrices();
    console.log('📊 Market Data:', marketData);

    // 2. Store market snapshot
    await supabaseAdmin.from('market_snapshots').insert([
      { asset: 'BTC', price: marketData.BTC.price, metadata: { change_24h: marketData.BTC.change_24h, volume_24h: marketData.BTC.volume_24h } },
      { asset: 'ETH', price: marketData.ETH.price, metadata: { change_24h: marketData.ETH.change_24h, volume_24h: marketData.ETH.volume_24h } },
      { asset: 'SOL', price: marketData.SOL.price, metadata: { change_24h: marketData.SOL.change_24h, volume_24h: marketData.SOL.volume_24h } }
    ]);

    // 3. Get all active traders
    const { data: traders, error: tradersError } = await supabaseAdmin
      .from('ai_traders')
      .select('*')
      .eq('status', 'active');

    if (tradersError) {
      throw new Error(`Failed to fetch traders: ${tradersError.message}`);
    }

    if (!traders || traders.length === 0) {
      console.log('⚠️ No active traders found');
      return NextResponse.json({ success: false, message: 'No active traders' });
    }

    console.log(`🤖 Processing ${traders.length} traders...`);

    // 4. Process each trader
    const results = [];
    for (const trader of traders) {
      try {
        const model = getModelByModelName(trader.model_name);
        if (!model) {
          console.error(`❌ Model not found for trader ${trader.name} (model: ${trader.model_name})`);
          continue;
        }

        // Get trader's portfolio
        const { data: portfolios } = await supabaseAdmin
          .from('portfolios')
          .select('*')
          .eq('trader_id', trader.id);

        // Generate fake news snippet (you can integrate real news API later)
        const newsSnippets = [
          'Bitcoin sees strong institutional buying',
          'Ethereum network upgrade scheduled',
          'Major exchange reports record trading volume',
          'Crypto market shows resilience amid volatility',
          'Whale accumulation detected in SOL',
          'Market sentiment remains bullish',
          'Technical indicators suggest upward momentum',
          'DeFi protocols report increased activity'
        ];
        const newsSnippet = newsSnippets[Math.floor(Math.random() * newsSnippets.length)];

        // Calculate total portfolio value
        let totalPortfolioValue = trader.current_balance;
        if (portfolios) {
          for (const portfolio of portfolios) {
            const assetPrice = marketData[portfolio.asset]?.price || 0;
            totalPortfolioValue += portfolio.quantity * assetPrice;
          }
        }

        // Get trading decision from AI with enhanced prompt
        const decision = await getTradingDecision(model, {
          traderName: trader.name,
          personality: trader.personality,
          marketData,
          balance: trader.current_balance,
          holdings: (portfolios as Portfolio[]) || [],
          newsSnippet,
          totalPortfolioValue,
          initialBalance: trader.initial_balance
        });

        if (!decision) {
          console.error(`❌ Failed to get decision for ${trader.name}`);
          continue;
        }

        console.log(`💡 ${trader.name}: ${decision.action} ${decision.amount} ${decision.asset}`);

        // Check for panic sell (10% chance)
        const forcePanicSell = shouldPanicSell() && decision.action === 'buy' && portfolios && portfolios.length > 0;
        
        if (forcePanicSell) {
          // Override decision with panic sell
          const randomPortfolio = portfolios[Math.floor(Math.random() * portfolios.length)];
          decision.action = 'sell';
          decision.asset = randomPortfolio.asset;
          decision.amount = randomPortfolio.quantity * 0.5; // Sell half
          decision.reasoning = '⚠️ PANIC SELL! Market feels too risky right now!';
          console.log(`😱 ${trader.name} is panic selling!`);
        }

        // Execute the trade (check if asset exists in market data)
        const currentPrice = marketData[decision.asset]?.price;
        if (!currentPrice) {
          console.error(`❌ Asset ${decision.asset} not found in market data`);
          continue;
        }
        
        const trade = await executeTrade(trader as AITrader, decision, currentPrice);

        if (trade) {
          results.push({
            trader: trader.name,
            action: decision.action,
            asset: decision.asset,
            amount: decision.amount,
            success: true
          });
        }

      } catch (error) {
        console.error(`❌ Error processing trader ${trader.name}:`, error);
        results.push({
          trader: trader.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // 5. Update leaderboard (pass all market data)
    const leaderboardPrices: Record<string, number> = {};
    for (const [asset, data] of Object.entries(marketData)) {
      leaderboardPrices[asset] = data.price;
    }
    await updateLeaderboard(leaderboardPrices);

    console.log('✅ Trade cycle completed');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      marketData,
      results
    });

  } catch (error) {
    console.error('❌ Trade cycle error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel Cron
export async function POST(request: NextRequest) {
  return GET(request);
}


