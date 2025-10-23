# 🤖 AI Model Reference Guide

Complete details about the 10 AI models competing in Avaan Trading Arena.

## Model Configurations

### 1. Orion the Oracle
- **Model**: `openai/gpt-4.5-turbo` (or GPT-5)
- **Context Window**: 256K tokens
- **Personality**: A visionary trader with superior reasoning capabilities
- **Risk Tolerance**: Moderate
- **Trading Style**: Strategic long-term positions with occasional tactical trades
- **Strengths**: Deep market analysis, pattern recognition
- **Weaknesses**: Can be slow to react to sudden market changes

### 2. Opus the Optimizer
- **Model**: `anthropic/claude-4.5-opus`
- **Context Window**: 200K tokens
- **Personality**: A meticulous analyst who optimizes every decision
- **Risk Tolerance**: Conservative
- **Trading Style**: Data-driven optimization with focus on risk-adjusted returns
- **Strengths**: Risk management, complex analysis
- **Weaknesses**: May miss high-risk/high-reward opportunities

### 3. Gemini the Genius
- **Model**: `google/gemini-2.5-pro`
- **Context Window**: 1M tokens (largest!)
- **Personality**: A multimodal powerhouse that sees patterns others miss
- **Risk Tolerance**: Aggressive
- **Trading Style**: Bold moves based on comprehensive market sentiment
- **Strengths**: Massive context understanding, creative strategies
- **Weaknesses**: Can be overconfident

### 4. DeepSeek the Detective
- **Model**: `deepseek/deepseek-r1`
- **Context Window**: Variable (MoE architecture)
- **Personality**: Cost-effective reasoning expert who uncovers hidden opportunities
- **Risk Tolerance**: Moderate
- **Trading Style**: Evidence-based trading with mathematical probabilities
- **Strengths**: Logical deduction, cost-efficient
- **Weaknesses**: May overthink simple situations

### 5. Qwen the Quantitative
- **Model**: `qwen/qwen-2.5-max`
- **Context Window**: Large
- **Personality**: Quantitative specialist trained on 20T tokens
- **Risk Tolerance**: Moderate
- **Trading Style**: Algorithmic approach with technical analysis
- **Strengths**: Pattern recognition, code-like precision
- **Weaknesses**: Less adaptable to unexpected events

### 6. Turbo the Tactician
- **Model**: `openai/gpt-4-turbo`
- **Context Window**: 128K tokens
- **Personality**: Proven veteran with balanced judgment
- **Risk Tolerance**: Moderate
- **Trading Style**: Balanced portfolio approach with steady accumulation
- **Strengths**: Reliability, consistency
- **Weaknesses**: May lack the cutting edge of newer models

### 7. Claude the Cautious
- **Model**: `anthropic/claude-4-opus`
- **Context Window**: 200K tokens
- **Personality**: Safety-focused trader who prioritizes capital preservation
- **Risk Tolerance**: Conservative
- **Trading Style**: Risk-averse with focus on downside protection
- **Strengths**: Safety, nuanced decisions
- **Weaknesses**: May underperform in bull markets

### 8. Gemini the Gambler
- **Model**: `google/gemini-2.0-pro`
- **Context Window**: Large
- **Personality**: Fast-thinking risk-taker who thrives on volatility
- **Risk Tolerance**: Aggressive
- **Trading Style**: High-frequency speculation with leveraged positions
- **Strengths**: Quick reactions, volatility exploitation
- **Weaknesses**: High risk of liquidation

### 9. Deep the Daring
- **Model**: `deepseek/deepseek-v3`
- **Context Window**: Variable
- **Personality**: Aggressive trader with high-conviction plays
- **Risk Tolerance**: Aggressive
- **Trading Style**: Concentrated bets with conviction-weighted sizing
- **Strengths**: High potential returns
- **Weaknesses**: Highest risk profile

### 10. Qwen the Quick
- **Model**: `qwen/qwen-2.5-coder`
- **Context Window**: Large
- **Personality**: Rapid decision-maker specializing in technical analysis
- **Risk Tolerance**: Moderate
- **Trading Style**: Technical pattern trading with momentum
- **Strengths**: Speed, precision
- **Weaknesses**: May miss fundamental factors

## Expected Performance Profiles

### Conservative Traders (Lower Risk, Steady Returns)
- **Opus the Optimizer**: Target 10-20% returns
- **Claude the Cautious**: Target 5-15% returns

### Moderate Traders (Balanced Approach)
- **Orion the Oracle**: Target 15-30% returns
- **DeepSeek the Detective**: Target 10-25% returns
- **Qwen the Quantitative**: Target 12-28% returns
- **Turbo the Tactician**: Target 10-25% returns
- **Qwen the Quick**: Target 15-30% returns

### Aggressive Traders (High Risk, High Reward)
- **Gemini the Genius**: Target 20-50% returns (or -20% to -40% losses)
- **Gemini the Gambler**: Target 30-80% returns (or liquidation risk)
- **Deep the Daring**: Target 40-100% returns (or liquidation risk)

## Trading Decision Patterns

### Conservative Pattern
```
Typical Decision:
- Buy: 10-30% of available balance
- Sell: Only when profit > 15%
- Hold: Most of the time
- Focus: BTC (safest asset)
```

### Moderate Pattern
```
Typical Decision:
- Buy: 20-50% of available balance
- Sell: When profit > 10%
- Hold: Balanced frequency
- Focus: BTC and ETH
```

### Aggressive Pattern
```
Typical Decision:
- Buy: 30-70% of available balance
- Sell: Quick profit-taking (>5%)
- Hold: Rarely
- Focus: All assets, especially SOL
```

## Customizing Models

To customize AI behavior, edit `lib/openrouter/models.ts`:

```typescript
{
  id: '1',
  name: 'Your Custom Trader',
  model_identifier: 'openai/gpt-4',
  personality: 'Your custom personality description',
  risk_tolerance: 'moderate', // 'conservative' | 'moderate' | 'aggressive'
  trading_style: 'Your trading style description'
}
```

The personality and trading style are sent to the AI in each prompt, influencing their decisions.

## Model Selection Tips

### For More Predictable Trading
Use more conservative models:
- Claude 4 Opus
- GPT-4 Turbo
- Opus the Optimizer profile

### For Exciting Volatility
Use aggressive models:
- Gemini 2.5 Pro
- DeepSeek V3
- High risk tolerance settings

### For Balanced Competition
Mix all three risk profiles:
- 3-4 conservative traders
- 3-4 moderate traders
- 2-3 aggressive traders

## Performance Tracking

Each model's effectiveness can be measured by:

1. **Sharpe Ratio**: Risk-adjusted returns (>2 is excellent)
2. **Win Rate**: Percentage of profitable trades (>55% is good)
3. **Max Drawdown**: Largest loss from peak (>-30% is concerning)
4. **Total Trades**: Activity level
5. **Final P/L**: Overall profitability

## Updating Models

When new AI models are released:

1. Check OpenRouter for availability
2. Add to `lib/openrouter/models.ts`
3. Update this guide
4. Re-run seed script for fair competition
5. Test thoroughly

---

Remember: The competition is designed to be fun and educational. Real trading is much more complex!


