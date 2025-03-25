---
sidebar_position: 1
sidebar_label: 'Monitoring Performance'
---

# Monitoring System Performance
This guide demonstrates how to implement comprehensive system performance monitoring using System Resource Monitor.

## Real-Time System Monitor
Here's how to create a basic real-time system monitor that tracks CPU, memory, and thread usage:
```javascript
import {
  startProfilingCpu,
  getCpuUsage,
  getMemoryUsage,
  getMinThread,
  getMaxThread,
  getAvgThread,
  delay,
  stopProfilingCpu,
} from 'system-resource-monitor';

async function monitorSystem() {
  // Initialize CPU profiling
  await startProfilingCpu();
  
  try {
    // Print header
    console.log('\n=== System Resource Monitor ===\n');
    
    while (true) {
      // Get current metrics
      const cpuUsage = getCpuUsage();
      const memUsage = getMemoryUsage(true);
      
      // Calculate thread statistics
      const minThreadUsage = getMinThread();
      const maxThreadUsage = getMaxThread();
      const avgThreadUsage = getAvgThread();
      
      // Clear previous output
      console.clear();
      
      // Display metrics
      console.log('=== System Resource Monitor ===');
      console.log(`CPU Usage: ${cpuUsage.toFixed(1)}%`);
      console.log(`Memory Usage: ${memUsage.toFixed(1)}%`);
      console.log('\nThread Usage:');
      console.log(`  Min: ${minThreadUsage.toFixed(1)}%`);
      console.log(`  Max: ${maxThreadUsage.toFixed(1)}%`);
      console.log(`  Avg: ${avgThreadUsage.toFixed(1)}%`);
      
      // Wait before next update
      await delay(1000);
    }
  } catch (error) {
    console.error('Monitoring error:', error);
  }
  
  stopProfilingCpu();
}

// Start monitoring
monitorSystem();
```

## Resource Usage Alerts
This example shows how to implement alerts for high resource usage:
```javascript
import {
  startProfilingCpu,
  isCpuAbove,
  isMemoryAbove,
  isAnyThreadAbove,
  getThreadUsage,
  delay,
  stopProfilingCpu,
} from 'system-resource-monitor';

async function monitorWithAlerts() {
  const CPU_THRESHOLD = 80;
  const MEMORY_THRESHOLD = 90;
  const THREAD_THRESHOLD = 95;
  
  // Initialize CPU profiling
  await startProfilingCpu();
  
  try {
    while (true) {
      // Check CPU usage
      if (isCpuAbove(CPU_THRESHOLD)) {
        console.warn(`⚠️ High CPU usage detected (>${CPU_THRESHOLD}%)`);
      }
      
      // Check memory usage
      if (isMemoryAbove(MEMORY_THRESHOLD)) {
        console.warn(`⚠️ High memory usage detected (>${MEMORY_THRESHOLD}%)`);
      }
      
      // Check thread usage
      if (isAnyThreadAbove(THREAD_THRESHOLD)) {
        const threadUsages = getThreadUsage();
        const highThreads = threadUsages
          .map((usage, index) => ({ index, usage: usage * 100 }))
          .filter(thread => thread.usage > THREAD_THRESHOLD);
          
        console.warn(`⚠️ High thread usage detected:`);
        highThreads.forEach(thread => {
          console.warn(`   Thread ${thread.index}: ${thread.usage.toFixed(1)}%`);
        });
      }
      
      await delay(5000); // Check every 5 seconds
    }
  } catch (error) {
    console.error('Alert monitoring error:', error);
  }
  
  stopProfilingCpu();
}

// Start alert monitoring
monitorWithAlerts();
```

:::caution
- CPU and thread monitoring functions require calling `startProfilingCpu()` first
- More frequent sampling (shorter intervals) may:
  - Increase CPU overhead
  - Provide less accurate readings
  - Impact system performance
For most applications, using intervals of 1 second or longer is recommended.
:::
