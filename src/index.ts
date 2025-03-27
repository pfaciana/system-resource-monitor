/**
 * @module system-resource-monitor
 *
 * A cross-platform utility for monitoring system resources such as CPU usage, memory usage, and thread utilization.
 * This module provides functions to check CPU and memory usage and thread states across different operating systems
 * (Windows, macOS, and Linux).
 *
 * @example
 * ```ts
 * import { startProfilingCpu, getCpuUsage, getMemoryUsage, cleanup } from '@rndr/system-resource-monitor';
 *
 * // Start profiling the CPU
 * await startProfilingCpu();
 *
 * // Get CPU and memory usage
 * console.log(`CPU usage: ${getCpuUsage()}%`);
 * console.log(`Memory usage: ${getMemoryUsage(true)}%`);
 *
 * // Clean up when done
 * stopProfilingCpu();
 * ```
 */

import os from 'node:os'
import { execSync } from 'node:child_process'

/**
 * Creates a promise that resolves after a specified number of milliseconds.
 *
 * @example
 * ```ts
 * // Wait for 1 second
 * await delay(1000);
 * ```
 *
 * @param {number} ms - The number of milliseconds to delay
 * @returns {Promise<void>} A promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Rounds a number to a specified precision.
 *
 * @example
 * ```ts
 * // Round to 2 decimal places
 * const value = round(10.12345, 2); // Returns 10.12
 * ```
 *
 * @param {number} num - The number to round
 * @param {number} [precision=0] - The number of decimal places to round to
 * @returns {number} The rounded number
 */
export const round = (num: number, precision: number = 0): number => {
	const factor = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}

const platform = os.platform()
/**
 * Returns the current operating system platform.
 *
 * @example
 * ```ts
 * const platform = getPlatform();
 * if (platform === 'win32') {
 *   console.log('Running on Windows');
 * }
 * ```
 *
 * @returns {string} The platform identifier ('win32', 'darwin', 'linux', etc.)
 */
export const getPlatform = (): string => platform

// Cores

const logicalCoreCount = os.cpus().length
/**
 * Returns the number of logical CPU cores available on the system.
 *
 * @example
 * ```ts
 * console.log(`This system has ${getLogicalCoreCount()} logical cores`);
 * ```
 *
 * @returns {number} The number of logical CPU cores
 */
export const getLogicalCoreCount = (): number => logicalCoreCount

const physicalCores = ((): number => {
	try {
		if (platform === 'linux') {
			const output = execSync('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l', { encoding: 'utf8' }).toString()
			return parseInt(output.trim(), 10)
		} else if (platform === 'darwin') {
			const output = execSync('sysctl -n hw.physicalcpu', { encoding: 'utf8' }).toString()
			return parseInt(output.trim(), 10)
		} else if (platform === 'win32') {
			let output = execSync('WMIC CPU Get NumberOfCores', { encoding: 'utf8' }).toString()
			if (!output.includes('NumberOfCores')) {
				output = execSync('powershell -command "(Get-CimInstance -ClassName Win32_Processor).NumberOfCores"', { encoding: 'utf8' }).toString()
			}
			const cores = output.split('\n').map(line => parseInt(line, 10)).filter(line => line && !isNaN(line))
			return cores.reduce((acc, coreCount) => acc + coreCount, 0)
		}
	} catch (error) {
		console.error('Error getting physical core count:', error)
	}
	return Math.max(1, Math.floor(logicalCoreCount / 2))
})()

/**
 * Returns the number of physical CPU cores available on the system.
 * Uses platform-specific commands to determine the actual physical core count.
 *
 * @example
 * ```ts
 * console.log(`This system has ${getPhysicalCoreCount()} physical cores`);
 * ```
 *
 * @returns {number} The number of physical CPU cores
 */
export const getPhysicalCoreCount = (): number => physicalCores

/**
 * CPU time information for a single CPU core.
 *
 * @interface CpuTimes
 * @property {number} idle - Time spent in idle state
 * @property {number} irq - Time spent handling interrupts
 * @property {number} nice - Time spent running processes with modified scheduling priority
 * @property {number} sys - Time spent in kernel mode
 * @property {number} user - Time spent in user mode
 */
export interface CpuTimes {
	idle: number;
	irq: number;
	nice: number;
	sys: number;
	user: number;
}

/**
 * Information about a CPU core.
 *
 * @interface CpuInfo
 * @property {string} model - The model identifier of the CPU
 * @property {number} speed - The speed of the CPU in MHz
 * @property {CpuTimes} times - The CPU time information
 */
export interface CpuInfo {
	model: string;
	speed: number;
	times: CpuTimes;
}

/**
 * Represents the state of a CPU thread at a point in time.
 *
 * @interface ThreadState
 * @property {number} index - The index of the thread
 * @property {number} total - The total CPU time
 * @property {number} idle - The idle CPU time
 */
export interface ThreadState {
	index: number;
	total: number;
	idle: number;
}

/**
 * Represents CPU thread usage as a number between 0 and 1.
 * A value of 0 means the thread is completely idle, while 1 means it's at 100% usage.
 */
export type ThreadUsage = number;

// Threads

/**
 * Gets the current state of all CPU threads.
 *
 * @example
 * ```ts
 * const threadStates = getThreadState();
 * console.log(`Thread 0 total time: ${threadStates[0].total}`);
 * ```
 *
 * @returns {ThreadState[]} An array of thread states
 */
export const getThreadState = (): ThreadState[] => {
	const cpus: CpuInfo[] = os.cpus()
	return cpus.map((cpu, index) => {
		const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
		const idle = cpu.times.idle
		return { index, total, idle }
	})
}

let startState: ThreadState[] | null = null
let stateUpdateInterval: NodeJS.Timeout | null = null
/**
 * Internal function to get and periodically update the baseline thread state.
 *
 * @private
 *
 * @returns {Promise<ThreadState[]>} A promise that resolves to the baseline thread state
 */
const getStartState = async (): Promise<ThreadState[]> => {
	if (!startState) {
		startState = getThreadState()
		await delay(100)
		if (stateUpdateInterval) {
			clearInterval(stateUpdateInterval)
		}
		stateUpdateInterval = setInterval(async () => {
			const tempStartState = getThreadState()
			await delay(500)
			startState = tempStartState
		}, 1000)

		if (stateUpdateInterval.unref) {
			stateUpdateInterval.unref()
		}
	}
	return startState
}

/**
 * Starts CPU profiling by establishing a baseline for CPU usage measurements.
 * Must be called before using functions that compare current CPU usage to a baseline.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * // Now you can use functions like getCpuUsage(), getThreadUsage(), etc.
 * ```
 *
 * @returns {Promise<void>} A promise that resolves when profiling has started
 */
export const startProfilingCpu = async (): Promise<void> => {
	await getStartState()
}

/**
 * Stops CPU profiling and cleans up resources.
 *
 * @example
 * ```ts
 * // When done with CPU profiling
 * stopProfilingCpu();
 * ```
 *
 * @returns {void}
 */
export const stopProfilingCpu = (): void => {
	cleanup()
}

/**
 * Cleans up resources used by the CPU profiling system.
 * Stops interval timers and resets the baseline state.
 *
 * @example
 * ```ts
 * // When done with the library
 * cleanup();
 * ```
 *
 * @returns {void}
 */
export const cleanup = (): void => {
	if (stateUpdateInterval) {
		clearInterval(stateUpdateInterval)
		stateUpdateInterval = null
	}
	startState = null
}

// Handle normal exit
process.on('beforeExit', cleanup)

// Handle Ctrl+C
process.on('SIGINT', () => {
	cleanup()
	process.exit(0)
})

// Handle kill command
process.on('SIGTERM', () => {
	cleanup()
	process.exit(0)
})

/**
 * Calculates the usage of a single thread by comparing start and end states.
 *
 * @private
 *
 * @param {ThreadState} startThread - The initial state of the thread
 * @param {ThreadState} endThread - The current state of the thread
 * @returns {ThreadUsage} A number between 0 and 1 representing the thread usage
 */
const calculateThreadUsage = (startThread: ThreadState, endThread: ThreadState): ThreadUsage => {
	const totalDiff = endThread.total - startThread.total
	const idleDiff = endThread.idle - startThread.idle
	return (totalDiff - idleDiff) / totalDiff
}

/**
 * Gets the usage of all CPU threads by comparing start and end states.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const usage = getThreadUsage();
 * console.log(`Thread 0 usage: ${usage[0] * 100}%`);
 * ```
 *
 * @param {ThreadState[] | null} [startThreads=startState] - The initial state of threads, defaults to stored start state
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {ThreadUsage[]} An array of thread usage values between 0 and 1
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getThreadUsage = (startThreads: ThreadState[] | null = startState, endThreads: ThreadState[] = getThreadState()): ThreadUsage[] => {
	if (!startThreads) {
		console.error('You must run `await startProfilingCpu()` before you can get the thread state')
		throw new Error('Start threads not available')
	}
	return startThreads!.map((startThread, index) => {
		return calculateThreadUsage(startThread, endThreads[index])
	})
}

/**
 * Checks if any thread's CPU usage is below a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (isAnyThreadBelow(20)) {
 *   console.log('At least one thread is below 20% usage');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if any thread is below the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const isAnyThreadBelow = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	if (!startState) {
		console.error('You must run `await startProfilingCpu()` before you can get the thread state')
		throw new Error('Start threads not available')
	}
	const thresholdDecimal = threshold / 100
	return startState!.some((startThread, index) => {
		const usage = calculateThreadUsage(startThread, endThreads[index])
		return usage < thresholdDecimal
	})
}

/**
 * Checks if any thread's CPU usage is above a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (isAnyThreadAbove(80)) {
 *   console.log('At least one thread is above 80% usage');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if any thread is above the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const isAnyThreadAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !areAllThreadsBelow(threshold, endThreads)
}

/**
 * Checks if all threads' CPU usage is below a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (areAllThreadsBelow(60)) {
 *   console.log('All threads are below 60% usage');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if all threads are below the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const areAllThreadsBelow = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	if (!startState) {
		console.error('You must run `await startProfilingCpu()` before you can get the thread state')
		throw new Error('Start threads not available')
	}
	const thresholdDecimal = threshold / 100
	return startState!.every((startThread, index) => {
		const usage = calculateThreadUsage(startThread, endThreads[index])
		return usage < thresholdDecimal
	})
}

/**
 * Checks if all threads' CPU usage is above a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (areAllThreadsAbove(30)) {
 *   console.log('All threads are above 30% usage');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if all threads are above the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const areAllThreadsAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !isAnyThreadBelow(threshold, endThreads)
}

/**
 * Gets the minimum CPU usage across all threads.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const minUsage = getMinThread(); // Returns the minimum usage as a percentage
 * console.log(`Minimum thread usage: ${minUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=true] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @param {ThreadUsage[]} [threadsUsage=getThreadUsage()] - Thread usage values to analyze
 * @returns {number} The minimum thread usage value
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getMinThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const minThread = Math.min(...threadsUsage)
	return round(inPercent ? minThread * 100 : minThread, precision)
}

/**
 * Gets the maximum CPU usage across all threads.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const maxUsage = getMaxThread(); // Returns the maximum usage as a percentage
 * console.log(`Maximum thread usage: ${maxUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=true] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @param {ThreadUsage[]} [threadsUsage=getThreadUsage()] - Thread usage values to analyze
 * @returns {number} The maximum thread usage value
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getMaxThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const maxThread = Math.max(...threadsUsage)
	return round(inPercent ? maxThread * 100 : maxThread, precision)
}

/**
 * Gets the average CPU usage across all threads.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const avgUsage = getAvgThread(); // Returns the average usage as a percentage
 * console.log(`Average thread usage: ${avgUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=true] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @param {ThreadUsage[]} [threadsUsage=getThreadUsage()] - Thread usage values to analyze
 * @returns {number} The average thread usage value
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getAvgThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const avgThread = threadsUsage.reduce((acc, item) => acc + item, 0) / threadsUsage.length
	return round(inPercent ? avgThread * 100 : avgThread, precision)
}

/**
 * Gets the median CPU usage across all threads.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const medUsage = getMedThread(); // Returns the median usage as a percentage
 * console.log(`Median thread usage: ${medUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=true] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @param {ThreadUsage[]} [threadsUsage=getThreadUsage()] - Thread usage values to analyze
 * @returns {number} The median thread usage value
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getMedThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	threadsUsage.sort((a, b) => a - b)
	const medThread = threadsUsage[Math.floor(threadsUsage.length / 2)]
	return round(inPercent ? medThread * 100 : medThread, precision)
}

// CPU

/**
 * Gets the overall CPU usage by comparing the start and current states of all threads.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * const cpuUsage = getCpuUsage(); // Returns CPU usage as a percentage
 * console.log(`Current CPU usage: ${cpuUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=true] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {number} The overall CPU usage value
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const getCpuUsage = (inPercent: boolean = true, precision: number = 5, endThreads: ThreadState[] = getThreadState()): number => {
	if (!startState) {
		console.error('You must run `await startProfilingCpu()` before you can get the thread state')
		throw new Error('Start threads not available')
	}
	const totalStart = startState!.reduce((acc, cpu) => {
		acc.total += cpu.total
		acc.idle += cpu.idle
		return acc
	}, { total: 0, idle: 0 })

	const totalEnd = endThreads.reduce((acc, cpu) => {
		acc.total += cpu.total
		acc.idle += cpu.idle
		return acc
	}, { total: 0, idle: 0 })

	const totalDiff = totalEnd.total - totalStart.total
	const idleDiff = totalEnd.idle - totalStart.idle
	const cpuUsage = (totalDiff - idleDiff) / totalDiff
	return round(inPercent ? cpuUsage * 100 : cpuUsage, precision)
}

/**
 * Checks if CPU usage is below a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (isCpuBelow(20)) {
 *   console.log('CPU usage is below 20%');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if CPU usage is below the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const isCpuBelow = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return getCpuUsage(true, 5, endThreads) < threshold
}

/**
 * Checks if CPU usage is above a specified threshold.
 *
 * @example
 * ```ts
 * await startProfilingCpu();
 * if (isCpuAbove(80)) {
 *   console.log('CPU usage is above 80%');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @param {ThreadState[]} [endThreads=getThreadState()] - The current state of threads
 * @returns {boolean} True if CPU usage is above the threshold
 * @throws {Error} If startProfilingCpu() has not been called before
 */
export const isCpuAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !isCpuBelow(threshold, endThreads)
}

// Memory

const totalMemory = os.totalmem()
/**
 * Gets the total system memory.
 *
 * @example
 * ```ts
 * const totalMemGB = getTotalMemory(true, 2);
 * console.log(`Total system memory: ${totalMemGB} GB`);
 * ```
 *
 * @param {boolean} [inGB=false] - Whether to return the result in gigabytes (true) or bytes (false)
 * @param {number} [precision=0] - The number of decimal places to round to
 * @returns {number} The total system memory
 */
export const getTotalMemory = (inGB: boolean = false, precision: number = 0): number => {
	return inGB ? round(totalMemory / 1024 / 1024 / 1024, precision) : totalMemory
}

/**
 * Gets the used system memory.
 *
 * @example
 * ```ts
 * const usedMemGB = getUsedMemory(true, 2);
 * console.log(`Used system memory: ${usedMemGB} GB`);
 * ```
 *
 * @param {boolean} [inGB=false] - Whether to return the result in gigabytes (true) or bytes (false)
 * @param {number} [precision=0] - The number of decimal places to round to
 * @returns {number} The used system memory
 */
export const getUsedMemory = (inGB: boolean = false, precision: number = 0): number => {
	let usedMemory = totalMemory - os.freemem()
	return inGB ? round(usedMemory / 1024 / 1024 / 1024, precision) : usedMemory
}

/**
 * Gets the memory usage as a ratio or percentage.
 *
 * @example
 * ```ts
 * const memUsage = getMemoryUsage(true);
 * console.log(`Current memory usage: ${memUsage}%`);
 * ```
 *
 * @param {boolean} [inPercent=false] - Whether to return the result as a percentage (0-100) or decimal (0-1)
 * @param {number} [precision=5] - The number of decimal places to round to
 * @returns {number} The memory usage value
 */
export const getMemoryUsage = (inPercent: boolean = false, precision: number = 5): number => {
	let memoryUsage = (getUsedMemory() / totalMemory)
	memoryUsage = inPercent ? memoryUsage * 100 : memoryUsage
	return round(memoryUsage, precision)
}

/**
 * Checks if memory usage is below a specified threshold.
 *
 * @example
 * ```ts
 * if (isMemoryBelow(70)) {
 *   console.log('Memory usage is below 70%');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @returns {boolean} True if memory usage is below the threshold
 */
export const isMemoryBelow = (threshold: number = 50): boolean => {
	return getMemoryUsage(true) < threshold
}

/**
 * Checks if memory usage is above a specified threshold.
 *
 * @example
 * ```ts
 * if (isMemoryAbove(80)) {
 *   console.log('Memory usage is above 80%');
 * }
 * ```
 *
 * @param {number} [threshold=50] - The threshold percentage (0-100)
 * @returns {boolean} True if memory usage is above the threshold
 */
export const isMemoryAbove = (threshold: number = 50): boolean => {
	return !isMemoryBelow(threshold)
}
