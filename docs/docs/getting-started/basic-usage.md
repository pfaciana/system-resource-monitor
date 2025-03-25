---
sidebar_position: 3
sidebar_label: 'Basic Usage'
---

# Basic Usage

This guide will show you how to use the core features of System Resource Monitor to track CPU, memory, and thread usage.

## System Information

Get basic system information:

```javascript
import {
	getPhysicalCoreCount,
	getLogicalCoreCount,
	getPlatform
} from 'system-resource-monitor';

console.log(`Platform: ${getPlatform()}`);
console.log(`Physical CPU Cores: ${getPhysicalCoreCount()}`);
console.log(`Logical CPU Cores: ${getLogicalCoreCount()}`);
```

## Memory Usage

Track system memory usage with these functions:

```javascript
import {
	getMemoryUsage,
	getTotalMemory,
	getUsedMemory
} from 'system-resource-monitor';

// Get memory usage as a percentage
console.log(`Memory Usage: ${getMemoryUsage(true)}%`);

// Get total and used memory in GB
console.log(`Total Memory: ${getTotalMemory(true)}GB`);
console.log(`Used Memory: ${getUsedMemory(true)}GB`);
```

## CPU Monitoring

The library provides several functions to monitor CPU usage:

```javascript
import {
	startProfilingCpu,
	stopProfilingCpu,
	getCpuUsage,
	isCpuAbove,
	isCpuBelow,
} from 'system-resource-monitor'

// Initialize CPU profiling
await startProfilingCpu()

// Get overall CPU usage as a percentage
console.log(`CPU Usage: ${getCpuUsage()}%`) // e.g., "CPU Usage: 45.2%"

// Check if CPU usage exceeds a threshold
if (isCpuAbove(80)) {
	console.log('High CPU usage detected!')
}

// Check if CPU usage is below a threshold
if (isCpuBelow(10)) {
	console.log('CPU usage is low!')
}

stopProfilingCpu()
```

:::caution Important

The `startProfilingCpu()` function must be called before using any CPU or thread monitoring functions. This is not required for memory, core information, or utility functions.

```javascript
import { startProfilingCpu, stopProfilingCpu } from 'system-resource-monitor';

// Start CPU profiling
await startProfilingCpu();

// ... use CPU and thread monitoring functions ...

// Stop CPU profiling when done
stopProfilingCpu();
```

:::

## Thread Management

Monitor individual CPU threads and their utilization:

```javascript
import {
	startProfilingCpu,
	stopProfilingCpu,
	getThreadUsage,
	getMinThread,
	getMaxThread,
	getAvgThread,
	isAnyThreadAbove,
} from 'system-resource-monitor'

// Initialize CPU profiling
await startProfilingCpu()

// Get usage for each CPU thread
const threadUsages = getThreadUsage()
console.log('Thread Usage:', threadUsages)

// Get statistics about thread usage
console.log(`Minimum Thread Usage: ${getMinThread(true)}%`)
console.log(`Maximum Thread Usage: ${getMaxThread(true)}%`)
console.log(`Average Thread Usage: ${getAvgThread(true)}%`)

// Check if any thread exceeds a threshold
if (isAnyThreadAbove(90)) {
	console.log('Warning: At least one thread is under heavy load!')
}

stopProfilingCpu()
```

## Utility Functions

The library includes some helpful utility functions:

```javascript
import { delay, round } from 'system-resource-monitor';

// Wait for a specific duration
await delay(1000); // waits for 1 second

// Round numbers to a specific precision
console.log(round(45.6789, 2)); // outputs: 45.68
```
