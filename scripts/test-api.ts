/**
 * API Testing Script
 * Tests all major API endpoints and database connections
 * 
 * Run with: npx tsx scripts/test-api.ts
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('\n📊 Testing Supabase Connection...');
  
  try {
    const { data, error } = await supabase
      .from('ai_traders')
      .select('count');
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

async function testTradersTable() {
  console.log('\n🤖 Testing AI Traders Table...');
  
  try {
    const { data, error } = await supabase
      .from('ai_traders')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('⚠️  No traders found. Run: npm run seed');
      return false;
    }
    
    console.log(`✅ Found ${data.length} traders`);
    data.forEach(trader => {
      console.log(`   - ${trader.name}: $${trader.current_balance} (${trader.profit_loss_percentage.toFixed(2)}%)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error loading traders:', error);
    return false;
  }
}

async function testTradesTable() {
  console.log('\n📝 Testing Trades Table...');
  
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .limit(5)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('⚠️  No trades found. Run: npm run seed');
      return false;
    }
    
    console.log(`✅ Found trades (showing latest 5):`);
    data.forEach(trade => {
      console.log(`   - ${trade.action.toUpperCase()} ${trade.amount.toFixed(4)} ${trade.asset} @ $${trade.price}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error loading trades:', error);
    return false;
  }
}

async function testHyperliquidAPI() {
  console.log('\n💱 Testing Hyperliquid API...');
  
  try {
    const response = await axios.post('https://api.hyperliquid.xyz/info', {
      type: 'allMids'
    });
    
    const prices = response.data;
    
    console.log('✅ Hyperliquid API working:');
    console.log(`   - BTC: $${parseFloat(prices['BTC'] || '0').toLocaleString()}`);
    console.log(`   - ETH: $${parseFloat(prices['ETH'] || '0').toLocaleString()}`);
    console.log(`   - SOL: $${parseFloat(prices['SOL'] || '0').toLocaleString()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Hyperliquid API failed:', error);
    console.log('   Using fallback prices in the app');
    return false;
  }
}

async function testOpenRouterAPI() {
  console.log('\n🤖 Testing OpenRouter API...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  OPENROUTER_API_KEY not set');
    return false;
  }
  
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ OpenRouter API key is valid');
      console.log(`   - ${response.data.data?.length || 0} models available`);
      return true;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Invalid OpenRouter API key');
    } else {
      console.error('❌ OpenRouter API error:', error.message);
    }
    return false;
  }
  
  return false;
}

async function testLocalEndpoint() {
  console.log('\n🔧 Testing Local Trade Cycle Endpoint...');
  
  try {
    const response = await axios.get('http://localhost:3000/api/cron/trade-cycle', {
      timeout: 30000 // 30 seconds
    });
    
    if (response.data.success) {
      console.log('✅ Trade cycle endpoint working');
      console.log(`   - Processed ${response.data.results?.length || 0} traders`);
      return true;
    } else {
      console.log('⚠️  Trade cycle returned error:', response.data.error);
      return false;
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Server not running. Start with: npm run dev');
    } else {
      console.error('❌ Error testing endpoint:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('🧪 Running Avaan Trading Arena API Tests\n');
  console.log('='.repeat(50));
  
  const results = {
    supabase: await testSupabaseConnection(),
    traders: await testTradersTable(),
    trades: await testTradesTable(),
    hyperliquid: await testHyperliquidAPI(),
    openrouter: await testOpenRouterAPI(),
    endpoint: await testLocalEndpoint()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results Summary:\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  console.log('\nDetails:');
  console.log(`  Supabase Connection: ${results.supabase ? '✅' : '❌'}`);
  console.log(`  AI Traders Table: ${results.traders ? '✅' : '❌'}`);
  console.log(`  Trades Table: ${results.trades ? '✅' : '❌'}`);
  console.log(`  Hyperliquid API: ${results.hyperliquid ? '✅' : '❌'}`);
  console.log(`  OpenRouter API: ${results.openrouter ? '✅' : '❌'}`);
  console.log(`  Trade Cycle Endpoint: ${results.endpoint ? '✅' : '❌'}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Your setup is complete.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
    process.exit(1);
  }
}

runTests();


