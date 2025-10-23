#!/usr/bin/env tsx

import { getCurrentPrices } from '../lib/hyperliquid/client';

async function testPercentageChanges() {
  console.log('🧪 Testing percentage changes...\n');
  
  try {
    const marketData = await getCurrentPrices();
    
    console.log('📊 Market Data Results:');
    console.log('======================');
    
    Object.entries(marketData).forEach(([asset, data]) => {
      console.log(`\n${asset}:`);
      console.log(`  Price: $${data.price.toLocaleString()}`);
      console.log(`  24h Change: ${data.change_24h >= 0 ? '+' : ''}${data.change_24h.toFixed(2)}%`);
      console.log(`  Volume: $${data.volume_24h.toLocaleString()}`);
      
      // Check if change is 0
      if (data.change_24h === 0) {
        console.log(`  ⚠️  WARNING: Change is 0! This might be the issue.`);
      } else {
        console.log(`  ✅ Change is working: ${data.change_24h > 0 ? '📈' : '📉'} ${Math.abs(data.change_24h).toFixed(2)}%`);
      }
    });
    
    console.log('\n🎯 Summary:');
    const allChanges = Object.values(marketData).map(data => data.change_24h);
    const zeroChanges = allChanges.filter(change => change === 0).length;
    
    if (zeroChanges === 0) {
      console.log('✅ All percentage changes are working correctly!');
    } else {
      console.log(`⚠️  ${zeroChanges} out of ${allChanges.length} assets have 0% change`);
      console.log('This suggests the API might not be providing 24h change data correctly.');
    }
    
  } catch (error) {
    console.error('❌ Error testing percentage changes:', error);
  }
}

// Run the test
testPercentageChanges();
