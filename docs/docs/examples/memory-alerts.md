---
sidebar_position: 3
sidebar_label: 'Memory Alerts'
---

# Memory Usage Alerts

This guide demonstrates how to implement effective memory monitoring and alert systems.

## Memory Health Monitor

Create a comprehensive memory health monitoring system:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
<TabItem value="typescript" label="TypeScript">

```typescript
import {
  getMemoryUsage,
  getTotalMemory,
  getUsedMemory,
  delay
} from 'system-resource-monitor';

interface MemoryHealth {
  status: 'healthy' | 'warning' | 'critical';
  usagePercent: number;
  freeGB: number;
  totalGB: number;
  message: string;
}

async function monitorMemoryHealth(
  warningThreshold: number = 70,
  criticalThreshold: number = 90
): Promise<void> {
  try {
    while (true) {
      const health = checkMemoryHealth(warningThreshold, criticalThreshold);
      displayMemoryStatus(health);
      await delay(1000);
    }
  } catch (error) {
    console.error('Memory monitoring error:', error);
  }
}

function checkMemoryHealth(
  warningThreshold: number,
  criticalThreshold: number
): MemoryHealth {
  const usagePercent = getMemoryUsage(true);
  const totalGB = getTotalMemory(true);
  const usedGB = getUsedMemory(true);
  const freeGB = totalGB - usedGB;
  
  let status: MemoryHealth['status'] = 'healthy';
  let message = 'Memory usage is normal';
  
  if (usagePercent >= criticalThreshold) {
    status = 'critical';
    message = `Critical: Memory usage is at ${usagePercent.toFixed(1)}%`;
  } else if (usagePercent >= warningThreshold) {
    status = 'warning';
    message = `Warning: Memory usage is at ${usagePercent.toFixed(1)}%`;
  }
  
  return { status, usagePercent, freeGB, totalGB, message };
}

function displayMemoryStatus(health: MemoryHealth): void {
  const colors = {
    healthy: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    critical: '\x1b[31m', // Red
    reset: '\x1b[0m'
  };
  
  console.clear();
  console.log('=== Memory Health Monitor ===\n');
  console.log(`Status: ${colors[health.status]}${health.status}${colors.reset}`);
  console.log(`Usage: ${health.usagePercent.toFixed(1)}%`);
  console.log(`Free Memory: ${health.freeGB.toFixed(1)} GB`);
  console.log(`Total Memory: ${health.totalGB.toFixed(1)} GB`);
  console.log(`\nMessage: ${health.message}`);
}

monitorMemoryHealth()
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
import {
  getMemoryUsage,
  getTotalMemory,
  getUsedMemory,
  delay
} from 'system-resource-monitor';

async function monitorMemoryHealth(
  warningThreshold = 70,
  criticalThreshold = 90
) {
  try {
    while (true) {
      const health = checkMemoryHealth(warningThreshold, criticalThreshold);
      displayMemoryStatus(health);
      await delay(1000);
    }
  } catch (error) {
    console.error('Memory monitoring error:', error);
  }
}

function checkMemoryHealth(warningThreshold, criticalThreshold) {
  const usagePercent = getMemoryUsage(true);
  const totalGB = getTotalMemory(true);
  const usedGB = getUsedMemory(true);
  const freeGB = totalGB - usedGB;
  
  let status = 'healthy';
  let message = 'Memory usage is normal';
  
  if (usagePercent >= criticalThreshold) {
    status = 'critical';
    message = `Critical: Memory usage is at ${usagePercent.toFixed(1)}%`;
  } else if (usagePercent >= warningThreshold) {
    status = 'warning';
    message = `Warning: Memory usage is at ${usagePercent.toFixed(1)}%`;
  }
  
  return { status, usagePercent, freeGB, totalGB, message };
}

function displayMemoryStatus(health) {
  const colors = {
    healthy: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    critical: '\x1b[31m', // Red
    reset: '\x1b[0m'
  };
  
  console.clear();
  console.log('=== Memory Health Monitor ===\n');
  console.log(`Status: ${colors[health.status]}${health.status}${colors.reset}`);
  console.log(`Usage: ${health.usagePercent.toFixed(1)}%`);
  console.log(`Free Memory: ${health.freeGB.toFixed(1)} GB`);
  console.log(`Total Memory: ${health.totalGB.toFixed(1)} GB`);
  console.log(`\nMessage: ${health.message}`);
}

monitorMemoryHealth()
```

</TabItem>
</Tabs>

## Graduated Alert System

Implement a graduated alert system with different severity levels:

<Tabs groupId="programming-language">
<TabItem value="typescript" label="TypeScript">

```typescript
import {
  getMemoryUsage,
  delay
} from 'system-resource-monitor';

interface MemoryAlert {
  level: 'info' | 'warning' | 'error' | 'critical';
  threshold: number;
  message: string;
  action?: () => Promise<void>;
}

class MemoryAlertSystem {
  private readonly alerts: MemoryAlert[];
  private activeAlerts: Set<string> = new Set();
  
  constructor() {
    this.alerts = [
      {
        level: 'info',
        threshold: 50,
        message: 'Memory usage above 50%'
      },
      {
        level: 'warning',
        threshold: 70,
        message: 'Memory usage above 70%',
        action: async () => {
          console.warn('Consider freeing up memory');
        }
      },
      {
        level: 'error',
        threshold: 85,
        message: 'Memory usage above 85%',
        action: async () => {
          console.error('Memory pressure detected');
          // Add your memory pressure handling here
        }
      },
      {
        level: 'critical',
        threshold: 95,
        message: 'Critical memory usage',
        action: async () => {
          console.error('Taking emergency action');
          // Add your emergency handling here
        }
      }
    ];
  }
  
  async monitor(): Promise<void> {
    try {
      while (true) {
        const usage = getMemoryUsage(true);
        await this.checkAlerts(usage);
        await delay(1000);
      }
    } catch (error) {
      console.error('Alert system error:', error);
    }
  }
  
  private async checkAlerts(usage: number): Promise<void> {
    for (const alert of this.alerts) {
      const alertKey = `${alert.level}-${alert.threshold}`;
      
      if (usage >= alert.threshold) {
        if (!this.activeAlerts.has(alertKey)) {
          this.activeAlerts.add(alertKey);
          console.log(`[${alert.level.toUpperCase()}] ${alert.message}`);
          if (alert.action) {
            await alert.action();
          }
        }
      } else {
        this.activeAlerts.delete(alertKey);
      }
    }
  }
}

const alertSystem = new MemoryAlertSystem()
await alertSystem.monitor()
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
import {
  getMemoryUsage,
  delay
} from 'system-resource-monitor';

class MemoryAlertSystem {
  constructor() {
    this.alerts = [
      {
        level: 'info',
        threshold: 50,
        message: 'Memory usage above 50%'
      },
      {
        level: 'warning',
        threshold: 70,
        message: 'Memory usage above 70%',
        action: async () => {
          console.warn('Consider freeing up memory');
        }
      },
      {
        level: 'error',
        threshold: 85,
        message: 'Memory usage above 85%',
        action: async () => {
          console.error('Memory pressure detected');
          // Add your memory pressure handling here
        }
      },
      {
        level: 'critical',
        threshold: 95,
        message: 'Critical memory usage',
        action: async () => {
          console.error('Taking emergency action');
          // Add your emergency handling here
        }
      }
    ];
    this.activeAlerts = new Set();
  }
  
  async monitor() {
    try {
      while (true) {
        const usage = getMemoryUsage(true);
        await this.checkAlerts(usage);
        await delay(1000);
      }
    } catch (error) {
      console.error('Alert system error:', error);
    }
  }
  
  async checkAlerts(usage) {
    for (const alert of this.alerts) {
      const alertKey = `${alert.level}-${alert.threshold}`;
      
      if (usage >= alert.threshold) {
        if (!this.activeAlerts.has(alertKey)) {
          this.activeAlerts.add(alertKey);
          console.log(`[${alert.level.toUpperCase()}] ${alert.message}`);
          if (alert.action) {
            await alert.action();
          }
        }
      } else {
        this.activeAlerts.delete(alertKey);
      }
    }
  }
}

const alertSystem = new MemoryAlertSystem()
await alertSystem.monitor()
```

</TabItem>
</Tabs>