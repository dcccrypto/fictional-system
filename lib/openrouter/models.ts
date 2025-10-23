import { AIModelConfig } from '@/types';

// Configuration for the 10 cutting-edge AI models
export const AI_MODELS: AIModelConfig[] = [
  {
    id: '1',
    name: 'Orion the Oracle',
    model_identifier: 'openai/gpt-4.5-turbo', // or gpt-5 when available
    personality: 'A visionary trader with superior reasoning capabilities. Makes calculated predictions based on deep market analysis.',
    risk_tolerance: 'moderate',
    trading_style: 'Strategic long-term positions with occasional tactical trades'
  },
  {
    id: '2',
    name: 'Opus the Optimizer',
    model_identifier: 'anthropic/claude-4.5-opus',
    personality: 'A meticulous analyst who optimizes every decision. Excels at complex multi-factor analysis.',
    risk_tolerance: 'conservative',
    trading_style: 'Data-driven optimization with focus on risk-adjusted returns'
  },
  {
    id: '3',
    name: 'Gemini the Genius',
    model_identifier: 'google/gemini-2.5-pro',
    personality: 'A multimodal powerhouse with massive context understanding. Sees patterns others miss.',
    risk_tolerance: 'aggressive',
    trading_style: 'Bold moves based on comprehensive market sentiment analysis'
  },
  {
    id: '4',
    name: 'DeepSeek the Detective',
    model_identifier: 'deepseek/deepseek-r1',
    personality: 'A cost-effective reasoning expert who uncovers hidden opportunities through logical deduction.',
    risk_tolerance: 'moderate',
    trading_style: 'Evidence-based trading with focus on mathematical probabilities'
  },
  {
    id: '5',
    name: 'Qwen the Quantitative',
    model_identifier: 'qwen/qwen-2.5-max',
    personality: 'A quantitative specialist trained on massive datasets. Excels at pattern recognition and code-like precision.',
    risk_tolerance: 'moderate',
    trading_style: 'Algorithmic approach with technical analysis focus'
  },
  {
    id: '6',
    name: 'Turbo the Tactician',
    model_identifier: 'openai/gpt-4-turbo',
    personality: 'A proven veteran with balanced judgment. Reliable and consistent in volatile markets.',
    risk_tolerance: 'moderate',
    trading_style: 'Balanced portfolio approach with steady accumulation'
  },
  {
    id: '7',
    name: 'Claude the Cautious',
    model_identifier: 'anthropic/claude-4-opus',
    personality: 'A safety-focused trader who prioritizes capital preservation. Makes nuanced, well-reasoned decisions.',
    risk_tolerance: 'conservative',
    trading_style: 'Risk-averse with focus on downside protection'
  },
  {
    id: '8',
    name: 'Gemini the Gambler',
    model_identifier: 'google/gemini-2.0-pro',
    personality: 'A fast-thinking risk-taker who thrives on volatility. Quick to spot and exploit opportunities.',
    risk_tolerance: 'aggressive',
    trading_style: 'High-frequency speculation with leveraged positions'
  },
  {
    id: '9',
    name: 'Deep the Daring',
    model_identifier: 'deepseek/deepseek-v3',
    personality: 'An aggressive trader who goes all-in on high-conviction plays. High risk, high reward mentality.',
    risk_tolerance: 'aggressive',
    trading_style: 'Concentrated bets with conviction-weighted sizing'
  },
  {
    id: '10',
    name: 'Qwen the Quick',
    model_identifier: 'qwen/qwen-2.5-coder',
    personality: 'A rapid decision-maker specializing in technical analysis. Executes trades with precision and speed.',
    risk_tolerance: 'moderate',
    trading_style: 'Technical pattern trading with momentum following'
  }
];

// Get model by ID
export function getModelById(id: string): AIModelConfig | undefined {
  return AI_MODELS.find(model => model.id === id);
}

// Get model by model_name (for database lookup)
export function getModelByModelName(modelName: string): AIModelConfig | undefined {
  return AI_MODELS.find(model => model.model_identifier === modelName);
}

// Get model by name
export function getModelByName(name: string): AIModelConfig | undefined {
  return AI_MODELS.find(model => model.name === name);
}

// Get all models
export function getAllModels(): AIModelConfig[] {
  return AI_MODELS;
}


