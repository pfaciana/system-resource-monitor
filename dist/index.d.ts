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
export declare const delay: (ms: number) => Promise<void>;
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
export declare const round: (num: number, precision?: number) => number;
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
export declare const getPlatform: () => string;
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
export declare const getLogicalCoreCount: () => number;
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
export declare const getPhysicalCoreCount: () => number;
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
export declare const getThreadState: () => ThreadState[];
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
export declare const startProfilingCpu: () => Promise<void>;
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
export declare const stopProfilingCpu: () => void;
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
export declare const cleanup: () => void;
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
export declare const getThreadUsage: (startThreads?: ThreadState[] | null, endThreads?: ThreadState[]) => ThreadUsage[];
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
export declare const isAnyThreadBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const isAnyThreadAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const areAllThreadsBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const areAllThreadsAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const getMinThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number;
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
export declare const getMaxThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number;
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
export declare const getAvgThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number;
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
export declare const getMedThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number;
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
export declare const getCpuUsage: (inPercent?: boolean, precision?: number, endThreads?: ThreadState[]) => number;
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
export declare const isCpuBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const isCpuAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean;
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
export declare const getTotalMemory: (inGB?: boolean, precision?: number) => number;
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
export declare const getUsedMemory: (inGB?: boolean, precision?: number) => number;
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
export declare const getMemoryUsage: (inPercent?: boolean, precision?: number) => number;
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
export declare const isMemoryBelow: (threshold?: number) => boolean;
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
export declare const isMemoryAbove: (threshold?: number) => boolean;
//# sourceMappingURL=index.d.ts.map