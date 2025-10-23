import { supabaseAdmin } from '@/lib/supabase/client';
import { AITrader, TradingDecision, Portfolio, CryptoAsset, Trade } from '@/types';

/**
 * Adds realistic slippage to a price (0.1-0.5% variation)
 */
export function addSlippage(price: number, isBuy: boolean = true): number {
  const slippagePercent = 0.001 + Math.random() * 0.004; // 0.1-0.5%
  const slippage = isBuy ? 1 + slippagePercent : 1 - slippagePercent;
  return price * slippage;
}

/**
 * Generates a realistic fake transaction hash
 */
export function generateTransactionHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Executes a trade for a trader
 */
export async function executeTrade(
  trader: AITrader,
  decision: TradingDecision,
  currentPrice: number
): Promise<Trade | null> {
  try {
    const { asset, action, amount, reasoning } = decision;

    if (action === 'hold') {
      // Record hold decision but don't modify portfolio
      const { data: trade } = await supabaseAdmin
        .from('trades')
        .insert({
          trader_id: trader.id,
          asset,
          action: 'hold',
          amount: 0,
          price: currentPrice,
          transaction_hash: generateTransactionHash(),
          reasoning,
          slippage: 0,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      return trade;
    }

    if (action === 'buy') {
      // Calculate actual price with slippage
      const priceWithSlippage = addSlippage(currentPrice, true);
      const slippageAmount = priceWithSlippage - currentPrice;
      
      // Calculate quantity that can be bought
      const quantityToBuy = amount / priceWithSlippage;
      
      // Check if trader has enough balance
      if (amount > trader.current_balance) {
        console.log(`${trader.name} tried to buy $${amount} but only has $${trader.current_balance}`);
        return null;
      }

      // Update trader balance
      const newBalance = trader.current_balance - amount;
      await supabaseAdmin
        .from('ai_traders')
        .update({
          current_balance: newBalance,
          total_trades: trader.total_trades + 1
        })
        .eq('id', trader.id);

      // Update or create portfolio entry
      const { data: existingPortfolio } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('trader_id', trader.id)
        .eq('asset', asset)
        .single();

      if (existingPortfolio) {
        // Update existing position
        const newQuantity = existingPortfolio.quantity + quantityToBuy;
        const newAvgPrice = (
          (existingPortfolio.quantity * existingPortfolio.average_buy_price) +
          (quantityToBuy * priceWithSlippage)
        ) / newQuantity;

        await supabaseAdmin
          .from('portfolios')
          .update({
            quantity: newQuantity,
            average_buy_price: newAvgPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPortfolio.id);
      } else {
        // Create new position
        await supabaseAdmin
          .from('portfolios')
          .insert({
            trader_id: trader.id,
            asset,
            quantity: quantityToBuy,
            average_buy_price: priceWithSlippage,
            updated_at: new Date().toISOString()
          });
      }

      // Record the trade
      const { data: trade } = await supabaseAdmin
        .from('trades')
        .insert({
          trader_id: trader.id,
          asset,
          action: 'buy',
          amount: quantityToBuy,
          price: priceWithSlippage,
          transaction_hash: generateTransactionHash(),
          reasoning,
          slippage: slippageAmount,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      return trade;
    }

    if (action === 'sell') {
      // Get current portfolio
      const { data: portfolio } = await supabaseAdmin
        .from('portfolios')
        .select('*')
        .eq('trader_id', trader.id)
        .eq('asset', asset)
        .single();

      if (!portfolio || portfolio.quantity < amount) {
        console.log(`${trader.name} tried to sell ${amount} ${asset} but only has ${portfolio?.quantity || 0}`);
        return null;
      }

      // Calculate actual price with slippage
      const priceWithSlippage = addSlippage(currentPrice, false);
      const slippageAmount = currentPrice - priceWithSlippage;
      
      // Calculate USD received
      const usdReceived = amount * priceWithSlippage;

      // Update trader balance
      const newBalance = trader.current_balance + usdReceived;
      await supabaseAdmin
        .from('ai_traders')
        .update({
          current_balance: newBalance,
          total_trades: trader.total_trades + 1
        })
        .eq('id', trader.id);

      // Update portfolio
      const newQuantity = portfolio.quantity - amount;
      if (newQuantity > 0.0001) {
        // Keep the position
        await supabaseAdmin
          .from('portfolios')
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', portfolio.id);
      } else {
        // Close the position
        await supabaseAdmin
          .from('portfolios')
          .delete()
          .eq('id', portfolio.id);
      }

      // Record the trade
      const { data: trade } = await supabaseAdmin
        .from('trades')
        .insert({
          trader_id: trader.id,
          asset,
          action: 'sell',
          amount: amount,
          price: priceWithSlippage,
          transaction_hash: generateTransactionHash(),
          reasoning,
          slippage: slippageAmount,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      return trade;
    }

    return null;
  } catch (error) {
    console.error('Error executing trade:', error);
    return null;
  }
}

/**
 * Calculates the total portfolio value for a trader
 */
export async function calculatePortfolioValue(
  traderId: string,
  currentPrices: Record<string, number>
): Promise<number> {
  try {
    const { data: trader } = await supabaseAdmin
      .from('ai_traders')
      .select('current_balance')
      .eq('id', traderId)
      .single();

    const { data: portfolios } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .eq('trader_id', traderId);

    let totalValue = trader?.current_balance || 0;

    if (portfolios) {
      for (const portfolio of portfolios) {
        const price = currentPrices[portfolio.asset];
        if (price) {
          totalValue += portfolio.quantity * price;
        }
      }
    }

    return totalValue;
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    return 0;
  }
}

/**
 * Updates profit/loss percentage for a trader
 */
export async function updateProfitLoss(traderId: string, currentValue: number) {
  try {
    const { data: trader } = await supabaseAdmin
      .from('ai_traders')
      .select('initial_balance')
      .eq('id', traderId)
      .single();

    if (trader) {
      const profitLossPercentage = ((currentValue - trader.initial_balance) / trader.initial_balance) * 100;
      
      await supabaseAdmin
        .from('ai_traders')
        .update({ profit_loss_percentage: profitLossPercentage })
        .eq('id', traderId);
    }
  } catch (error) {
    console.error('Error updating profit/loss:', error);
  }
}

/**
 * Checks if a trader should be liquidated
 */
export async function checkLiquidation(traderId: string, currentValue: number) {
  try {
    if (currentValue < 10) {
      await supabaseAdmin
        .from('ai_traders')
        .update({ 
          status: 'liquidated',
          current_balance: 0
        })
        .eq('id', traderId);

      // Clear all portfolios
      await supabaseAdmin
        .from('portfolios')
        .delete()
        .eq('trader_id', traderId);

      console.log(`Trader ${traderId} has been liquidated`);
    }
  } catch (error) {
    console.error('Error checking liquidation:', error);
  }
}

/**
 * Updates the leaderboard by recalculating all trader values
 */
export async function updateLeaderboard(currentPrices: Record<string, number>) {
  try {
    const { data: traders } = await supabaseAdmin
      .from('ai_traders')
      .select('*')
      .eq('status', 'active');

    if (!traders) return;

    for (const trader of traders) {
      const portfolioValue = await calculatePortfolioValue(trader.id, currentPrices);
      await updateProfitLoss(trader.id, portfolioValue);
      await checkLiquidation(trader.id, portfolioValue);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

/**
 * Triggers a random panic sell for drama (10% chance)
 */
export function shouldPanicSell(): boolean {
  return Math.random() < 0.1; // 10% chance
}


