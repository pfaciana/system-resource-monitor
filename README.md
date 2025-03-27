# System Resource Monitor

This project provides a set of utility functions for monitoring system resources such as CPU usage, memory usage, and thread utilization. It allows you to retrieve information about the number of logical and physical CPU cores, calculate CPU and memory usage percentages, and check if resource usage exceeds or falls below certain thresholds.

## Use Cases

This project is suitable for applications that require real-time monitoring of system resources. It can be beneficial for:

- Performance tuning in server applications.
- Resource management in multi-threaded applications.
- Monitoring system health in testing environments.

### Installation

You can install this package from either JSR or npm:

#### JSR

```bash
npx jsr add @rndr/system-resource-monitor
```

#### npm

```bash
npm i system-resource-monitor
```

> **Notice:** The package name differs depending on the registry:
> - JSR: `@rndr/system-resource-monitor`
> - npm: `system-resource-monitor`

### Usage Examples

```typescript
import {
	startProfilingCpu,
	stopProfilingCpu,
	getCpuUsage,
	getThreadUsage,
	getMemoryUsage,
	getPhysicalCoreCount,
	isAnyThreadAbove,
	isCpuAbove,
} from 'system-resource-monitor' // or '@rndr/system-resource-monitor' with JSR

// Initialize CPU profiling (required for CPU and thread monitoring)
await startProfilingCpu()

// Get CPU usage as percentage
console.log(`CPU Usage: ${getCpuUsage()}%`)

// Monitor individual thread usage
const threadUsage = getThreadUsage()
console.log('Thread Usage:', threadUsage)

// Get memory usage as percentage
console.log(`Memory Usage: ${getMemoryUsage(true)}%`)

// Check if any thread is above 80% usage
const isAbove80 = isAnyThreadAbove(80)
console.log(`Is any thread above 80% usage? ${isAbove80}`)

// Threshold checking
if (isCpuAbove(80)) {
	console.log('High CPU usage detected')
}

// Clean up when done
stopProfilingCpu()
```

### API Reference

NOTE: percentages represent a number between 0-100, raw usage represents a number between 0-1

`threshold` parameters are expected to be percentages between 0-100

**Initialization:**

- `startProfilingCpu(): Promise<void>` - Initialize CPU profiling (required for CPU and thread monitoring)
- `stopProfilingCpu(): void` - Stop CPU profiling and clean up resources
- `cleanup(): void` - Alias for stopProfilingCpu()

**Core Information:**

- `getPlatform(): linux|darwin|win32` - Returns current OS platform
- `getLogicalCoreCount(): int` - Returns number of logical CPU cores
- `getPhysicalCoreCount(): int` - Returns number of physical CPU cores

**CPU Usage:** (requires startProfilingCpu)

- `getCpuUsage(inPercent?: boolean, precision?: number): number` - Returns CPU usage as percentage (0-100) or decimal (0-1)
- `isCpuBelow(threshold: number): boolean` - Checks if CPU usage is below threshold percentage
- `isCpuAbove(threshold: number): boolean` - Checks if CPU usage is above threshold percentage

**Thread Functions:** (requires startProfilingCpu)

- `getThreadState(): ThreadState[]` - Returns current state for each CPU thread
- `getThreadUsage(): number[]` - Returns usage for each thread as decimals (0-1)
- `isAnyThreadBelow(threshold: number): boolean` - Checks if any thread is below threshold percentage
- `isAnyThreadAbove(threshold: number): boolean` - Checks if any thread is above threshold percentage
- `areAllThreadsBelow(threshold: number): boolean` - Checks if all threads are below threshold percentage
- `areAllThreadsAbove(threshold: number): boolean` - Checks if all threads are above threshold percentage
- `getMinThread(inPercent?: boolean, precision?: number): number` - Returns least utilized thread usage
- `getMaxThread(inPercent?: boolean, precision?: number): number` - Returns most utilized thread usage
- `getAvgThread(inPercent?: boolean, precision?: number): number` - Returns average thread usage
- `getMedThread(inPercent?: boolean, precision?: number): number` - Returns median thread usage

**Memory:**

- `getTotalMemory(inGB?: boolean): number` - Returns total memory in GB or bytes
- `getUsedMemory(inGB?: boolean): number` - Returns used memory in GB or bytes
- `getMemoryUsage(inPercent?: boolean): number` - Returns memory usage as percentage or decimal
- `isMemoryBelow(threshold: number): boolean` - Checks if memory usage is below threshold percentage
- `isMemoryAbove(threshold: number): boolean` - Checks if memory usage is above threshold percentage

**Utilities:**

- `delay(ms: number): Promise<void>` - Promise that resolves after specified milliseconds
- `round(num: number, precision?: number): number` - Rounds number to specified decimal places

## Considerations

While this library provides useful functionality for monitoring system resources, there are a few things to consider:

- You must call `startProfilingCpu()` before using any CPU or thread monitoring functions. Memory, core information, and utility functions do not require initialization.
- The core usage logic relies on timing differences between CPU states, which can be inaccurate or unreliable under heavy load or virtualized environments. The accuracy of the resource usage calculations depends on a sampling interval of one second of the system's workload.
- Calculating CPU usage in real-time is imprecise, especially if your application's workload changes frequently. You should interpret these metrics as estimates.
- This is not recommended for production environments or precise performance analytics. If you require more extensive system monitoring capabilities or integration with external monitoring tools, you may consider alternatives like:
  - [systeminformation](https://github.com/sebhildebrandt/systeminformation): A powerful Node.js library for retrieving detailed system information, including CPU, memory, disk, network, and process-related data.
  - [node-os-utils](https://github.com/SunilWang/node-os-utils): A Node.js library that provides a set of utility functions for retrieving system information, including CPU usage, memory usage, and disk usage.
