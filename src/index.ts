import os from 'node:os'
import { execSync } from 'node:child_process'

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const round = (num: number, precision: number = 0): number => {
	const factor = Math.pow(10, precision)
	return Math.round(num * factor) / factor
}

const platform = os.platform()
export const getPlatform = (): string => platform

// Cores

const logicalCoreCount = os.cpus().length
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

export const getPhysicalCoreCount = () => physicalCores

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

// Threads

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
export const startProfilingCpu = async (): Promise<void> => {
	await getStartState()
}
export const stopProfilingCpu = (): void => {
	cleanup()
}

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

const calculateThreadUsage = (startThread: ThreadState, endThread: ThreadState): ThreadUsage => {
	const totalDiff = endThread.total - startThread.total
	const idleDiff = endThread.idle - startThread.idle
	return (totalDiff - idleDiff) / totalDiff
}

export const getThreadUsage = (startThreads: ThreadState[] | null = startState, endThreads: ThreadState[] = getThreadState()): ThreadUsage[] => {
	if (!startThreads) {
		console.error('You must run `await startProfilingCpu()` before you can get the thread state')
		throw new Error('Start threads not available')
	}
	return startThreads!.map((startThread, index) => {
		return calculateThreadUsage(startThread, endThreads[index])
	})
}

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

export const isAnyThreadAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !areAllThreadsBelow(threshold, endThreads)
}

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

export const areAllThreadsAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !isAnyThreadBelow(threshold, endThreads)
}

export const getMinThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const minThread = Math.min(...threadsUsage)
	return round(inPercent ? minThread * 100 : minThread, precision)
}

export const getMaxThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const maxThread = Math.max(...threadsUsage)
	return round(inPercent ? maxThread * 100 : maxThread, precision)
}

export const getAvgThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	const avgThread = threadsUsage.reduce((acc, item) => acc + item, 0) / threadsUsage.length
	return round(inPercent ? avgThread * 100 : avgThread, precision)
}

export const getMedThread = (inPercent: boolean = true, precision: number = 5, threadsUsage: ThreadUsage[] = getThreadUsage()): number => {
	threadsUsage.sort((a, b) => a - b)
	const medThread = threadsUsage[Math.floor(threadsUsage.length / 2)]
	return round(inPercent ? medThread * 100 : medThread, precision)
}

// CPU

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

export const isCpuBelow = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return getCpuUsage(true, 5, endThreads) < threshold
}

export const isCpuAbove = (threshold: number = 50, endThreads: ThreadState[] = getThreadState()): boolean => {
	return !isCpuBelow(threshold, endThreads)
}

// Memory

const totalMemory = os.totalmem()
export const getTotalMemory = (inGB: boolean = false, precision: number = 0): number => {
	return inGB ? round(totalMemory / 1024 / 1024 / 1024, precision) : totalMemory
}

export const getUsedMemory = (inGB: boolean = false, precision: number = 0): number => {
	let usedMemory = totalMemory - os.freemem()
	return inGB ? round(usedMemory / 1024 / 1024 / 1024, precision) : usedMemory
}

export const getMemoryUsage = (inPercent: boolean = false, precision: number = 5): number => {
	let memoryUsage = (getUsedMemory() / totalMemory)
	memoryUsage = inPercent ? memoryUsage * 100 : memoryUsage
	return round(memoryUsage, precision)
}

export const isMemoryBelow = (threshold: number = 50): boolean => {
	return getMemoryUsage(true) < threshold
}

export const isMemoryAbove = (threshold: number = 50): boolean => {
	return !isMemoryBelow(threshold)
}
