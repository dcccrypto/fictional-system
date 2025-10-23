#!/usr/bin/env tsx
/**
 * Fresh Initialization Script
 * 
 * Sets up ONLY the AI traders with starting balances.
 * NO fake history - everything starts from zero when deployed.
 * 
 * The AI models don't know this is a simulation - they think it's real trading!
 */

import { createClient } from '@supabase/supabase-js';
import { AI_MODELS } from '../lib/openrouter/models';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const STARTING_BALANCE = 250; // Each AI starts with $250

async function clearAllData() {
  console.log('🧹 Clearing all existing data...');
  
  try {
    // Clear in correct order (respecting foreign key constraints)
    await supabase.from('trades').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('portfolios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('market_snapshots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('ai_traders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Database cleared - starting fresh!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

async function createAITraders() {
  console.log('🤖 Creating AI traders...');
  
  try {
    const traders = AI_MODELS.map(model => ({
      name: model.name,
      model_name: model.model_identifier,
      personality: model.personality,
      initial_balance: STARTING_BALANCE,
      current_balance: STARTING_BALANCE,
      total_trades: 0,
      profit_loss_percentage: 0,
      status: "active"
    }));

    const { data, error } = await supabase
      .from('ai_traders')
      .insert(traders)
      .select();

    if (error) throw error;

    console.log(`✅ Created ${data?.length} AI traders:\n`);
    data?.forEach((trader, index) => {
      console.log(`   ${index + 1}. ${trader.name}`);
      console.log(`      Model: ${trader.model_name}`);
      console.log(`      Balance: $${trader.current_balance}`);
      console.log(`      Style: ${trader.personality.substring(0, 60)}...`);
      console.log('');
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error creating traders:', error);
    throw error;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   🚀 AVAAN TRADING ARENA - FRESH START 🚀    ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('This will create a CLEAN trading environment:');
  console.log('  ✓ 10 AI traders with $250 each');
  console.log('  ✓ NO fake history');
  console.log('  ✓ NO pre-generated trades');
  console.log('  ✓ Everything starts LIVE from scratch!');
  console.log('');
  console.log('The AI models will:');
  console.log('  • Think they\'re trading with REAL money');
  console.log('  • Make decisions based on LIVE market prices');
  console.log('  • Execute trades every 5 minutes');
  console.log('  • Compete to become #1 on the leaderboard!');
  console.log('');
  console.log('─'.repeat(50));
  console.log('');
  
  try {
    // Step 1: Clear everything
    await clearAllData();
    console.log('');
    
    // Step 2: Create AI traders
    await createAITraders();
    console.log('─'.repeat(50));
    console.log('');
    
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║          ✅ INITIALIZATION COMPLETE! ✅        ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('');
    console.log('  1. Start your dev server:');
    console.log('     npm run dev');
    console.log('');
    console.log('  2. Start live trading (in another terminal):');
    console.log('     npm run start-live');
    console.log('');
    console.log('  3. Watch the action at:');
    console.log('     http://localhost:3000/dashboard');
    console.log('');
    console.log('  4. Deploy to production:');
    console.log('     Deploy to Railway (backend) + Vercel (frontend)');
    console.log('     Vercel cron will handle automatic trading!');
    console.log('');
    console.log('💰 Each AI trader starts with $250');
    console.log('📊 Trading begins on first cycle (every 5 minutes)');
    console.log('🏆 Watch them compete in REAL-TIME!');
    console.log('');
    console.log('─'.repeat(50));
    console.log('');
    console.log('Happy trading! 🚀📈');
    
  } catch (error) {
    console.error('\n💥 Initialization failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main as initFresh };

