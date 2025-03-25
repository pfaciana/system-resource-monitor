---
sidebar_position: 3
sidebar_label: 'Memory'
---

# Memory

Functions for monitoring system memory usage.

## Memory Information

### `getTotalMemory()`

Returns the total system memory.

```typescript
function getTotalMemory(
  inGB?: boolean,
  precision?: number
): number
```

**Parameters:**
- `inGB` (optional) - If true, returns value in GB. If false, returns in bytes. Default: `false`
- `precision` (optional) - Number of decimal places when returning GB. Default: `0`

**Returns:**
- `number` - Total memory in GB or bytes

**Example:**
```javascript
import { getTotalMemory } from 'system-resource-monitor';

// Get total memory in GB
console.log(`Total Memory: ${getTotalMemory(true)}GB`);

// Get total memory in bytes
console.log(`Total Memory: ${getTotalMemory()} bytes`);
```

### `getUsedMemory()`

Returns the amount of used system memory.

```typescript
function getUsedMemory(
  inGB?: boolean,
  precision?: number
): number
```

**Parameters:**
- `inGB` (optional) - If true, returns value in GB. If false, returns in bytes. Default: `false`
- `precision` (optional) - Number of decimal places when returning GB. Default: `0`

**Returns:**
- `number` - Used memory in GB or bytes

**Example:**
```javascript
import { getUsedMemory } from 'system-resource-monitor';

// Get used memory in GB
console.log(`Used Memory: ${getUsedMemory(true)}GB`);

// Get used memory in bytes
console.log(`Used Memory: ${getUsedMemory()} bytes`);
```

## Memory Usage

### `getMemoryUsage()`

Returns the current memory usage as a percentage or decimal.

```typescript
function getMemoryUsage(
  inPercent?: boolean,
  precision?: number
): number
```

**Parameters:**
- `inPercent` (optional) - If true, returns percentage (0-100). If false, returns decimal (0-1). Default: `false`
- `precision` (optional) - Number of decimal places in result. Default: `5`

**Returns:**
- `number` - Memory usage value

**Example:**
```javascript
import { getMemoryUsage } from 'system-resource-monitor';

// Get memory usage as percentage
console.log(`Memory Usage: ${getMemoryUsage(true)}%`);

// Get memory usage as decimal
console.log(`Memory Usage: ${getMemoryUsage()}`);
```

## Memory Thresholds

### `isMemoryAbove()`

Checks if memory usage is above a specified threshold.

```typescript
function isMemoryAbove(
  threshold?: number
): boolean
```

**Parameters:**
- `threshold` (optional) - Percentage threshold to check against (0-100). Default: `50`

**Returns:**
- `boolean` - True if memory usage is above threshold

### `isMemoryBelow()`

Checks if memory usage is below a specified threshold.

```typescript
function isMemoryBelow(
  threshold?: number
): boolean
```

**Parameters:**
- `threshold` (optional) - Percentage threshold to check against (0-100). Default: `50`

**Returns:**
- `boolean` - True if memory usage is below threshold

**Example:**
```javascript
import { isMemoryAbove, isMemoryBelow } from 'system-resource-monitor';

// Check for high memory usage
if (isMemoryAbove(90)) {
  console.log('Warning: High memory usage!');
}

// Check for low memory usage
if (isMemoryBelow(10)) {
  console.log('System has plenty of free memory');
}
```

:::info Implementation Note
Memory functions use Node.js's built-in `os` module:
- Total memory: `os.totalmem()`
- Free memory: `os.freemem()`
- Used memory: `total - free`

These calls are synchronous and provide immediate results, unlike CPU monitoring which requires sampling intervals.
:::
