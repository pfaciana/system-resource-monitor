---
sidebar_position: 2
sidebar_label: 'Thread Balancing'
---

# Thread Load Balancing
This guide demonstrates how to monitor and optimize thread usage across your system.

## Load Distribution Monitoring
This example shows how to monitor thread load distribution in real-time:

```javascript
import {
  startProfilingCpu,
  stopProfilingCpu,
  getThreadUsage,
  isAnyThreadAbove,
  areAllThreadsBelow,
  delay
} from 'system-resource-monitor';

async function monitorLoadDistribution() {
  const HIGH_LOAD = 80;
  const LOW_LOAD = 20;
  
  // Initialize CPU profiling
  await startProfilingCpu();
  
  try {
    while (true) {
      const threadUsages = getThreadUsage();
      
      // Create a load distribution visualization
      console.clear();
      console.log('Thread Load Distribution:\n');
      
      threadUsages.forEach((usage, index) => {
        const usagePercent = usage * 100;
        const bars = '='.repeat(Math.floor(usagePercent / 2));
        const loadIndicator = usagePercent > HIGH_LOAD ? '!' : 
                            usagePercent < LOW_LOAD ? '-' : '|';
        
        console.log(
          `Thread ${index.toString().padStart(2, ' ')}: ` +
          `[${bars.padEnd(50, ' ')}] ${usagePercent.toFixed(1)}% ${loadIndicator}`
        );
      });
      
      // Check for load imbalances
      if (isAnyThreadAbove(HIGH_LOAD)) {
        console.log('\n⚠️ Some threads are overloaded');
      } else if (areAllThreadsBelow(LOW_LOAD)) {
        console.log('\nℹ️ System is underutilized');
      }
      
      await delay(1000);
    }
  } catch (error) {
    console.error('Load distribution monitoring error:', error);
  }
  stopProfilingCpu();
}

monitorLoadDistribution()
```
