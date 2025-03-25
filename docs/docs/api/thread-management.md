---
sidebar_position: 4
sidebar_label: 'Thread Management'
---

# Thread Management

Functions for monitoring and analyzing individual CPU threads.

## Initialization

Before using any thread monitoring functions, you must initialize the profiling system:

### `startProfilingCpu()`

Initializes CPU profiling. Must be called before using any thread monitoring functions.

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

## Thread State

### `getThreadState()`

Returns the current state of all CPU threads.

```typescript
function getThreadState(): ThreadState[]
```

**Returns:**

- `ThreadState[]` - Array of thread states containing total and idle times

**Example:**

```javascript
import { startProfilingCpu, stopProfilingCpu, getThreadState } from 'system-resource-monitor'

// Initialize CPU profiling
await startProfilingCpu()

const threadStates = getThreadState()
console.log('Thread States:', threadStates)

stopProfilingCpu()
```

### `getThreadUsage()`

Returns the usage percentage for each CPU thread.

```typescript
function getThreadUsage(
  startThreads?: ThreadState[] | null,
  endThreads?: ThreadState[]
): ThreadUsage[]
```

**Parameters:**

- `startThreads` (optional) - Initial thread states. Default: Uses internal state
- `endThreads` (optional) - Current thread states. Default: Uses `getThreadState()`

**Returns:**

- `ThreadUsage[]` - Array of thread usage values (0-1)

**Example:**

```javascript
import { startProfilingCpu, stopProfilingCpu, getThreadUsage } from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

const usage = getThreadUsage();
console.log('Thread Usage:', usage);

stopProfilingCpu()
```

## Thread Statistics

### `getMinThread()`

Returns the usage of the least utilized thread.

```typescript
function getMinThread(
  inPercent?: boolean,
  precision?: number,
  threadsUsage?: ThreadUsage[]
): number
```

**Parameters:**

- `inPercent` (optional) - If true, returns percentage (0-100). Default: `true`
- `precision` (optional) - Decimal places in result. Default: `5`
- `threadsUsage` (optional) - Thread usage values. Default: Uses `getThreadUsage()`

### `getMaxThread()`

Returns the usage of the most utilized thread.

```typescript
function getMaxThread(
  inPercent?: boolean,
  precision?: number,
  threadsUsage?: ThreadUsage[]
): number
```

### `getAvgThread()`

Returns the average usage across all threads.

```typescript
function getAvgThread(
  inPercent?: boolean,
  precision?: number,
  threadsUsage?: ThreadUsage[]
): number
```

### `getMedThread()`

Returns the median usage across all threads.

```typescript
function getMedThread(
  inPercent?: boolean,
  precision?: number,
  threadsUsage?: ThreadUsage[]
): number
```

**Example:**

```javascript
import {
  startProfilingCpu,
  stopProfilingCpu,
  getMinThread,
  getMaxThread,
  getAvgThread,
  getMedThread
} from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

console.log(`Min Thread Usage: ${getMinThread()}%`);
console.log(`Max Thread Usage: ${getMaxThread()}%`);
console.log(`Avg Thread Usage: ${getAvgThread()}%`);
console.log(`Med Thread Usage: ${getMedThread()}%`);

stopProfilingCpu()
```

## Thread Thresholds

### `isAnyThreadAbove()`

Checks if any thread's usage is above a threshold.

```typescript
function isAnyThreadAbove(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

**Parameters:**

- `threshold` (optional) - Percentage threshold (0-100). Default: `50`
- `endThreads` (optional) - Current thread states. Default: Uses `getThreadState()`

### `isAnyThreadBelow()`

Checks if any thread's usage is below a threshold.

```typescript
function isAnyThreadBelow(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

### `areAllThreadsAbove()`

Checks if all threads' usage is above a threshold.

```typescript
function areAllThreadsAbove(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

### `areAllThreadsBelow()`

Checks if all threads' usage is below a threshold.

```typescript
function areAllThreadsBelow(
  threshold?: number,
  endThreads?: ThreadState[]
): boolean
```

**Example:**

```javascript
import {
  startProfilingCpu,
  stopProfilingCpu,
  isAnyThreadAbove,
  areAllThreadsBelow
} from 'system-resource-monitor';

// Initialize CPU profiling
await startProfilingCpu();

// Check for any overloaded threads
if (isAnyThreadAbove(90)) {
  console.log('Warning: At least one thread is near capacity!');
}

// Check if system is idle
if (areAllThreadsBelow(10)) {
  console.log('System is idle');
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

type ThreadUsage = number;  // Thread usage as decimal (0-1)
```

:::tip Thread vs CPU Usage

- Thread usage functions monitor individual CPU threads
- CPU usage functions (`getCpuUsage()`) monitor overall system CPU utilization
- Use thread monitoring for detailed performance analysis
- Use CPU monitoring for general system health checks
- Both require calling `startProfilingCpu()` first
  :::
