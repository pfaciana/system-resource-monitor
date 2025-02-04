export declare const delay: (ms: number) => Promise<void>
export declare const round: (num: number, precision: number) => number
export declare const cleanup: () => void

export declare const getPlatform: () => string

// Core functions
export declare const getLogicalCoreCount: () => number
export declare const getPhysicalCoreCount: () => number

// Thread state and usage types
export interface CpuTimes {
	idle: number;
	irq: number;
	nice: number;
	sys: number;
	user: number;
}

export interface CpuInfo {
	model: string;
	speed: number;
	times: CpuTimes;
}

export interface ThreadState {
	index: number;
	total: number;
	idle: number;
}

export type ThreadUsage = number;

// Thread-related functions
export declare const getThreadState: () => ThreadState[]
export declare const getThreadUsage: (startThreads?: ThreadState[] | null, endThreads?: ThreadState[]) => ThreadUsage[]

// Thread statistics functions
export declare const getMinThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number
export declare const getMaxThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number
export declare const getAvgThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number
export declare const getMedThread: (inPercent?: boolean, precision?: number, threadsUsage?: ThreadUsage[]) => number

// Thread threshold functions
export declare const isAnyThreadBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean
export declare const isAnyThreadAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean
export declare const areAllThreadsBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean
export declare const areAllThreadsAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean

// CPU statistics functions
export declare const getCpuUsage: (inPercent?: boolean, precision?: number, endThreads?: ThreadState[]) => number

// CPU threshold functions
export declare const isCpuBelow: (threshold?: number, endThreads?: ThreadState[]) => boolean
export declare const isCpuAbove: (threshold?: number, endThreads?: ThreadState[]) => boolean

// Memory statistics functions
export declare const getMemoryUsage: (inPercent?: boolean, precision?: number) => number
export declare const getTotalMemory: (inGB?: boolean, precision?: number) => number
export declare const getUsedMemory: (inGB?: boolean, precision?: number) => number

// Memory threshold functions
export declare const isMemoryBelow: (threshold?: number) => boolean
export declare const isMemoryAbove: (threshold?: number) => boolean