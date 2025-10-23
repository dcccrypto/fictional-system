#!/usr/bin/env tsx
import axios from 'axios';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TRADE_CYCLE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

console.log('🚀 Starting Avaan Trading Arena Live Trading System');
console.log('==================================================');
console.log(`📡 API URL: ${APP_URL}`);
console.log(`⏱️  Trade Cycle: Every 5 minutes`);
console.log('==================================================\n');

let cycleCount = 0;

async function runTradeCycle() {
  cycleCount++;
  const now = new Date();
  const timestamp = now.toLocaleString();
  
  console.log(`\n🔄 [Cycle #${cycleCount}] Starting trade cycle at ${timestamp}`);
  console.log('─'.repeat(60));
  
  try {
    const response = await axios.get(`${APP_URL}/api/cron/trade-cycle`, {
      timeout: 290000, // 4 minutes 50 seconds (less than function timeout)
    });
    
    if (response.data.success) {
      console.log('✅ Trade cycle completed successfully');
      console.log(`📊 Market Data:`);
      console.log(`   BTC: $${response.data.marketData?.BTC?.price.toLocaleString() || 'N/A'}`);
      console.log(`   ETH: $${response.data.marketData?.ETH?.price.toLocaleString() || 'N/A'}`);
      console.log(`   SOL: $${response.data.marketData?.SOL?.price.toLocaleString() || 'N/A'}`);
      
      if (response.data.results && response.data.results.length > 0) {
        console.log(`\n📈 Trades Executed:`);
        response.data.results.forEach((result: any) => {
          if (result.success) {
            console.log(`   ✓ ${result.trader}: ${result.action.toUpperCase()} ${result.amount.toFixed(4)} ${result.asset}`);
          } else {
            console.log(`   ✗ ${result.trader}: ${result.error}`);
          }
        });
      }
    } else {
      console.error('❌ Trade cycle failed:', response.data.error || response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Network error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
    } else {
      console.error('❌ Unexpected error:', error);
    }
  }
  
  const nextCycle = new Date(now.getTime() + TRADE_CYCLE_INTERVAL);
  console.log(`\n⏰ Next cycle at ${nextCycle.toLocaleString()}`);
  console.log('─'.repeat(60));
}

// Run first cycle immediately
console.log('⚡ Running initial trade cycle...');
runTradeCycle();

// Set up interval for subsequent cycles
setInterval(runTradeCycle, TRADE_CYCLE_INTERVAL);

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping live trading system...');
  console.log(`📊 Total cycles completed: ${cycleCount}`);
  console.log('👋 Goodbye!');
  process.exit(0);
});

console.log('\n✅ Live trading system is running!');
console.log('   Press Ctrl+C to stop\n');

