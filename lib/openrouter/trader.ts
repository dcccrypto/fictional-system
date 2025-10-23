import axios from 'axios';
import { TradingDecision, MarketData, Portfolio } from '@/types';
import { AIModelConfig } from '@/types';
import { getTopAssets } from '@/lib/hyperliquid/client';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface TradingPromptData {
  traderName: string;
  personality: string;
  marketData: MarketData;
  balance: number;
  holdings: Portfolio[];
  newsSnippet?: string;
  totalPortfolioValue?: number;
  initialBalance?: number;
}

/**
 * Generates an enhanced trading prompt for an AI model
 */
function generateTradingPrompt(data: TradingPromptData): string {
  const { 
    traderName, 
    personality, 
    marketData, 
    balance, 
    holdings, 
    totalPortfolioValue = balance,
    initialBalance = 250
  } = data;
  
  // Calculate performance metrics
  const profitLoss = totalPortfolioValue - initialBalance;
  const profitLossPercent = ((profitLoss / initialBalance) * 100).toFixed(2);
  
  // Format current positions with P/L
  let positionsText = 'None (all cash)';
  if (holdings.length > 0) {
    positionsText = holdings.map(h => {
      const currentPrice = marketData[h.asset]?.price || h.average_buy_price;
      const positionValue = h.quantity * currentPrice;
      const entryValue = h.quantity * h.average_buy_price;
      const positionPL = ((positionValue - entryValue) / entryValue * 100).toFixed(2);
      const plSign = parseFloat(positionPL) >= 0 ? '+' : '';
      
      return `${h.quantity.toFixed(4)} ${h.asset} @ $${h.average_buy_price.toFixed(2)} (Current: $${currentPrice.toFixed(2)}, P/L: ${plSign}${positionPL}%)`;
    }).join('\n   ');
  }
  
  // Get top 20 assets by volume to show in prompt
  const topAssets = getTopAssets(marketData, 20);
  const marketDataText = topAssets.map(asset => {
    const data = marketData[asset];
    const changeSign = data.change_24h >= 0 ? '+' : '';
    return `- ${asset}: $${data.price.toLocaleString()} (24h: ${changeSign}${data.change_24h.toFixed(2)}%)`;
  }).join('\n');

  // Count total available assets
  const totalAssets = Object.keys(marketData).length;
  
  const newsSnippet = data.newsSnippet || 'Market trading normally with healthy volume across all pairs.';

  return `You are ${traderName}, a professional cryptocurrency trader managing a perpetual futures trading account.

YOUR PERSONALITY & STYLE:
${personality}

ACCOUNT PERFORMANCE:
- Starting Balance: $${initialBalance.toFixed(2)}
- Current Portfolio Value: $${totalPortfolioValue.toFixed(2)}
- Profit/Loss: $${profitLoss.toFixed(2)} (${profitLossPercent}%)
- Available Cash: $${balance.toFixed(2)}

CURRENT POSITIONS:
   ${positionsText}

MARKET DATA - Top 20 by Volume (${totalAssets} total assets available):
${marketDataText}

NOTE: You can trade ANY of the ${totalAssets} perpetual contracts available on this exchange, not just those listed above. Popular options include BTC, ETH, SOL, AVAX, BNB, MATIC, ATOM, DOT, UNI, LINK, DOGE, and many more.

RECENT MARKET NEWS:
${newsSnippet}

TRADING INSTRUCTIONS:
Based on the above information, make ONE trading decision right now:

1. SELECT ASSET: Choose ANY perpetual contract (e.g., BTC, ETH, SOL, AVAX, etc.)
2. CHOOSE ACTION:
   - "buy" = Open or add to long position
   - "sell" = Close or reduce existing position (you must own the asset)
   - "hold" = No action this cycle
3. SPECIFY AMOUNT:
   - If BUYING: Amount in USD to spend (e.g., 50 means spend $50)
   - If SELLING: Quantity of asset to sell (e.g., 0.5 means sell 0.5 BTC)
   - If HOLDING: Set to 0
4. EXPLAIN REASONING: Brief 1-2 sentence explanation

IMPORTANT RULES:
- Your trading style should reflect your personality above
- You CANNOT buy more than your available cash balance ($${balance.toFixed(2)})
- You CANNOT sell assets you don't own
- Consider your current positions and whether to take profits, cut losses, or hold
- Consider market momentum, trends, and your risk tolerance
- You can trade ANY perpetual contract available on the exchange

Respond ONLY with valid JSON in this exact format:
{
  "asset": "BTC",
  "action": "buy",
  "amount": 50,
  "reasoning": "Your brief explanation based on market analysis"
}`;
}

/**
 * Calls OpenRouter API to get a trading decision from an AI model
 */
export async function getTradingDecision(
  model: AIModelConfig,
  promptData: TradingPromptData
): Promise<TradingDecision | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return null;
  }

  try {
    const prompt = generateTradingPrompt(promptData);
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: model.model_identifier,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Avaan Trading Arena',
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI model');
    }

    // Parse the JSON response
    const decision = JSON.parse(content) as TradingDecision;
    
    // Basic validation (no specific asset validation - allow any asset)
    if (!decision.asset || typeof decision.asset !== 'string') {
      throw new Error(`Invalid asset: ${decision.asset}`);
    }
    
    if (!['buy', 'sell', 'hold'].includes(decision.action)) {
      throw new Error(`Invalid action: ${decision.action}`);
    }
    
    if (typeof decision.amount !== 'number' || decision.amount < 0) {
      throw new Error(`Invalid amount: ${decision.amount}`);
    }

    // Normalize asset to uppercase
    decision.asset = decision.asset.toUpperCase();

    return decision;
  } catch (error) {
    console.error(`Error getting trading decision from ${model.name}:`, error);
    
    // Return a fallback "hold" decision if API fails
    return {
      asset: 'BTC',
      action: 'hold',
      amount: 0,
      reasoning: 'Unable to analyze market conditions at this time, holding position.'
    };
  }
}

/**
 * Simulates a trading decision (for testing without API calls)
 */
export function simulateTradingDecision(
  model: AIModelConfig,
  promptData: TradingPromptData
): TradingDecision {
  const { marketData, balance } = promptData;
  
  // Get available assets
  const assets = Object.keys(marketData);
  const topAssets = getTopAssets(marketData, 10);
  
  // Simple logic based on risk tolerance
  const rand = Math.random();
  
  if (model.risk_tolerance === 'aggressive') {
    if (rand > 0.3) {
      // Aggressive traders buy more often
      const amount = balance * (0.3 + Math.random() * 0.4); // 30-70% of balance
      const asset = topAssets[Math.floor(Math.random() * Math.min(5, topAssets.length))];
      return {
        asset,
        action: 'buy',
        amount: Math.min(amount, balance),
        reasoning: 'Market conditions favor aggressive entry. High conviction play!'
      };
    }
  } else if (model.risk_tolerance === 'conservative') {
    if (rand > 0.7) {
      // Conservative traders buy less often and smaller amounts
      const amount = balance * (0.1 + Math.random() * 0.2); // 10-30% of balance
      return {
        asset: 'BTC',
        action: 'buy',
        amount: Math.min(amount, balance),
        reasoning: 'Safe opportunity identified. Entering with caution.'
      };
    }
  } else {
    // Moderate traders
    if (rand > 0.5) {
      const amount = balance * (0.2 + Math.random() * 0.3); // 20-50% of balance
      const asset = topAssets[Math.floor(Math.random() * Math.min(3, topAssets.length))];
      return {
        asset,
        action: 'buy',
        amount: Math.min(amount, balance),
        reasoning: 'Balanced approach to current market conditions.'
      };
    }
  }
  
  // Default to hold
  return {
    asset: 'BTC',
    action: 'hold',
    amount: 0,
    reasoning: 'Waiting for better market conditions.'
  };
}
