---
sidebar_position: 4
---

# Cross-Platform Detection

```javascript
import {
  getPlatform,
  getPhysicalCoreCount,
  getLogicalCoreCount
} from 'system-resource-monitor';

function analyzeCoreConfiguration() {
  const physicalCores = getPhysicalCoreCount();
  const logicalCores = getLogicalCoreCount();
  const platform = getPlatform();

  console.log(`Platform: ${platform}`);
  console.log(`Physical Cores: ${physicalCores}`);
  console.log(`Logical Cores: ${logicalCores}`);

  // Check for hyperthreading
  if (logicalCores > physicalCores) {
    console.log('Hyperthreading is enabled');
    console.log(`Threads per core: ${logicalCores / physicalCores}`);
  }
}

analyzeCoreConfiguration()
```
