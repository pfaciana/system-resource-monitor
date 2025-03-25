---
sidebar_position: 2
sidebar_label: 'CPU Usage'
---

# CPU Usage

Functions for monitoring overall CPU utilization.

## Initialization

Before using any CPU monitoring functions, you must initialize the profiling system:

### `startProfilingCpu()`

Initializes CPU profiling. Must be called before using any CPU monitoring functions.

```typescript
function startProfilingCpu(): Promise<void>
```

**Example:**

```javascript
import { startProfilingCpu } from 'system-resource-monitor';

await startProfilingCpu();
```

### `stopProfilingCpu()`

Stops CPU profiling and cleans up resources.

```typescript
function stopProfilingCpu(): void
```

**Example:**

```javascript
import { stopProfilingCpu } from 'system-resource-monitor';

stopProfilingCpu();
```

## Usage Monitoring

### `getCpuUsage()`

Returns the current CPU usage as a percentage or decimal.

```typescript
function getCpuUsage(
  inPercent?: boolean,
  precision?: number,
  endThreads?: ThreadState[]
): number
```

**Parameters:**

- `inPercent` (optional) - If true, returns value as percentage (0-100). If false, returns decimal (0-1). Default: `true`
- `precision` (optional) - Number of decimal places for the result. Default: `5`
- `endThreads` (optional) - Current thread states for calculation. Default: Uses `getThreadState()`

**Returns:**

- `number` - CPU usage value

**Example:**

```javascript
import { startProfilingCpu, stopProfilingCpu, getCpuUsage } from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

// Get usage as percentage
console.log(`CPU Usage: ${getCpuUsage()}%`); // e.g., "CPU Usage: 45.23%"

// Get raw usage (0-1) with 3 decimal places
console.log(`CPU Usage: ${getCpuUsage(false, 3)}`); // e.g., "CPU Usage: 0.452"

stopProfilingCpu()
```

## Threshold Checking

### `isCpuAbove()`

Checks if CPU usage is above a specified threshold.

```typescript
function isCpuAbove(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

**Parameters:**

- `threshold` (optional) - Percentage threshold to check against (0-100). Default: `50`
- `endThreads` (optional) - Current thread states for calculation. Default: Uses `getThreadState()`

**Returns:**

- `boolean` - True if CPU usage is above threshold, false otherwise

**Example:**

```javascript
import { startProfilingCpu, stopProfilingCpu, isCpuAbove } from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

// Check if CPU usage is above 80%
if (isCpuAbove(80)) {
  console.log('High CPU usage detected!');
}

stopProfilingCpu()
```

### `isCpuBelow()`

Checks if CPU usage is below a specified threshold.

```typescript
function isCpuBelow(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

**Parameters:**

- `threshold` (optional) - Percentage threshold to check against (0-100). Default: `50`
- `endThreads` (optional) - Current thread states for calculation. Default: Uses `getThreadState()`

**Returns:**

- `boolean` - True if CPU usage is below threshold, false otherwise

**Example:**

```javascript
import { startProfilingCpu, stopProfilingCpu, isCpuBelow } from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

// Check if CPU usage is below 20%
if (isCpuBelow(20)) {
  console.log('Low CPU usage detected');
}

stopProfilingCpu()
```

## Type Definitions

```typescript
interface ThreadState {
  index: number;  // Thread identifier
  total: number;  // Total CPU time
  idle: number;   // Idle CPU time
}
```

:::info Implementation Note
CPU usage is calculated by comparing CPU states over time:

1. Initialize profiling with `startProfilingCpu()`
2. Captures initial state
3. Waits for sampling interval
4. Captures final state
5. Calculates usage: `(totalDiff - idleDiff) / totalDiff`

The first reading will have a small delay while the initial state is established after calling `startProfilingCpu()`.
:::
