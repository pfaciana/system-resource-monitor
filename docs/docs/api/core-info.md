---
sidebar_position: 1
sidebar_label: 'Core Information'
---

# Core Information

These functions provide basic system information about the platform and CPU cores.

## Platform Detection

### `getPlatform()`

Returns the current operating system platform.

```typescript
function getPlatform(): 'linux' | 'darwin' | 'win32'
```

**Returns:**
- `'linux'` - Linux operating system
- `'darwin'` - macOS operating system
- `'win32'` - Windows operating system

**Example:**
```javascript
import { getPlatform } from 'system-resource-monitor';

const platform = getPlatform();
console.log(`Current platform: ${platform}`);
```

## CPU Core Information

### `getLogicalCoreCount()`

Returns the number of logical CPU cores (threads) available to the system.

```typescript
function getLogicalCoreCount(): number
```

**Returns:**
- `number` - The total number of logical CPU cores

**Example:**
```javascript
import { getLogicalCoreCount } from 'system-resource-monitor';

const logicalCores = getLogicalCoreCount();
console.log(`Number of logical cores: ${logicalCores}`);
```

### `getPhysicalCoreCount()`

Returns the number of physical CPU cores in the system.

```typescript
function getPhysicalCoreCount(): number
```

**Returns:**
- `number` - The total number of physical CPU cores

**Implementation Details:**
- Uses platform-specific commands to detect physical cores:
  - Linux: Uses `lscpu`
  - macOS: Uses `sysctl`
  - Windows: Uses `WMIC` or PowerShell as fallback
- Falls back to `logicalCoreCount / 2` if detection fails

**Example:**
```javascript
import { getPhysicalCoreCount } from 'system-resource-monitor';

const physicalCores = getPhysicalCoreCount();
console.log(`Number of physical cores: ${physicalCores}`);
```

:::tip
The difference between logical and physical cores is important for performance monitoring:
- Physical cores are actual CPU cores
- Logical cores include hyperthreaded/virtual cores
:::

## Type Definitions

```typescript
// No additional types for core information functions
```
