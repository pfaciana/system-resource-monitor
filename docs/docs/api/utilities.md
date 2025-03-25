---
sidebar_position: 5
sidebar_label: 'Utilities'
---

# Utilities

Helper functions for timing, formatting, and resource cleanup.

## Timing

### `delay()`

Creates a promise that resolves after a specified number of milliseconds.

```typescript
function delay(ms: number): Promise<void>
```

**Parameters:**
- `ms` - Number of milliseconds to delay

**Returns:**
- `Promise<void>` - Promise that resolves after the delay

**Example:**
```javascript
import { delay } from 'system-resource-monitor';

async function example() {
  console.log('Starting...');
  await delay(1000); // wait 1 second
  console.log('Done!');
}
await example();
```

## Formatting

### `round()`

Rounds a number to a specified number of decimal places.

```typescript
function round(
  num: number,
  precision?: number
): number
```

**Parameters:**
- `num` - Number to round
- `precision` (optional) - Number of decimal places. Default: `0`

**Returns:**
- `number` - Rounded number

**Example:**
```javascript
import { round } from 'system-resource-monitor';

console.log(round(3.14159)); // outputs: 3
console.log(round(3.14159, 2)); // outputs: 3.14
```

## Resource Management

### `cleanup()`

Cleans up monitoring state and intervals. This is called automatically on process exit, but can be called manually if needed.

```typescript
function cleanup(): void
```

**Example:**
```javascript
import { cleanup } from 'system-resource-monitor';

// Manual cleanup
cleanup();
```

:::note Automatic Cleanup
The library automatically registers cleanup handlers for:
- Normal process exit
- SIGINT (Ctrl+C)
- SIGTERM (kill command)

You typically don't need to call `cleanup()` manually unless you're doing specialized resource management.
:::

## Internal State Management

The library maintains internal state for CPU monitoring:
- Sampling intervals are managed automatically
- State is updated every second
- Resources are cleaned up on process exit

:::tip
If you need to ensure all resources are released before your application exits, you can call `cleanup()` manually. However, in most cases, the automatic cleanup will handle this for you.
:::
