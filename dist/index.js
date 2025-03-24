import os from 'node:os';
import { execSync } from 'node:child_process';
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const round = (num, precision = 0) => {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
};
const platform = os.platform();
export const getPlatform = () => platform;
// Cores
const logicalCoreCount = os.cpus().length;
export const getLogicalCoreCount = () => logicalCoreCount;
const physicalCores = (() => {
    try {
        if (platform === 'linux') {
            const output = execSync('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l', { encoding: 'utf8' }).toString();
            return parseInt(output.trim(), 10);
        }
        else if (platform === 'darwin') {
            const output = execSync('sysctl -n hw.physicalcpu', { encoding: 'utf8' }).toString();
            return parseInt(output.trim(), 10);
        }
        else if (platform === 'win32') {
            let output = execSync('WMIC CPU Get NumberOfCores', { encoding: 'utf8' }).toString();
            if (!output.includes('NumberOfCores')) {
                output = execSync('powershell -command "(Get-CimInstance -ClassName Win32_Processor).NumberOfCores"', { encoding: 'utf8' }).toString();
            }
            const cores = output.split('\n').map(line => parseInt(line, 10)).filter(line => line && !isNaN(line));
            return cores.reduce((acc, coreCount) => acc + coreCount, 0);
        }
    }
    catch (error) {
        console.error('Error getting physical core count:', error);
    }
    return Math.max(1, Math.floor(logicalCoreCount / 2));
})();
export const getPhysicalCoreCount = () => physicalCores;
// Threads
export const getThreadState = () => {
    const cpus = os.cpus();
    return cpus.map((cpu, index) => {
        const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
        const idle = cpu.times.idle;
        return { index, total, idle };
    });
};
let startState = null;
let stateUpdateInterval = null;
const getStartState = async () => {
    if (!startState) {
        startState = getThreadState();
        await delay(100);
        if (stateUpdateInterval) {
            clearInterval(stateUpdateInterval);
        }
        stateUpdateInterval = setInterval(async () => {
            const tempStartState = getThreadState();
            await delay(500);
            startState = tempStartState;
        }, 1000);
    }
    return startState;
};
getStartState();
export const cleanup = () => {
    if (stateUpdateInterval) {
        clearInterval(stateUpdateInterval);
        stateUpdateInterval = null;
    }
    startState = null;
};
// Handle normal exit
process.on('beforeExit', cleanup);
// Handle Ctrl+C
process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
});
// Handle kill command
process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
});
const calculateThreadUsage = (startThread, endThread) => {
    const totalDiff = endThread.total - startThread.total;
    const idleDiff = endThread.idle - startThread.idle;
    return (totalDiff - idleDiff) / totalDiff;
};
export const getThreadUsage = (startThreads = startState, endThreads = getThreadState()) => {
    return startThreads.map((startThread, index) => {
        return calculateThreadUsage(startThread, endThreads[index]);
    });
};
export const isAnyThreadBelow = (threshold = 50, endThreads = getThreadState()) => {
    const thresholdDecimal = threshold / 100;
    return startState.some((startThread, index) => {
        const usage = calculateThreadUsage(startThread, endThreads[index]);
        return usage < thresholdDecimal;
    });
};
export const isAnyThreadAbove = (threshold = 50, endThreads = getThreadState()) => {
    return !areAllThreadsBelow(threshold, endThreads);
};
export const areAllThreadsBelow = (threshold = 50, endThreads = getThreadState()) => {
    const thresholdDecimal = threshold / 100;
    return startState.every((startThread, index) => {
        const usage = calculateThreadUsage(startThread, endThreads[index]);
        return usage < thresholdDecimal;
    });
};
export const areAllThreadsAbove = (threshold = 50, endThreads = getThreadState()) => {
    return !isAnyThreadBelow(threshold, endThreads);
};
export const getMinThread = (inPercent = true, precision = 5, threadsUsage = getThreadUsage()) => {
    const minThread = Math.min(...threadsUsage);
    return round(inPercent ? minThread * 100 : minThread, precision);
};
export const getMaxThread = (inPercent = true, precision = 5, threadsUsage = getThreadUsage()) => {
    const maxThread = Math.max(...threadsUsage);
    return round(inPercent ? maxThread * 100 : maxThread, precision);
};
export const getAvgThread = (inPercent = true, precision = 5, threadsUsage = getThreadUsage()) => {
    const avgThread = threadsUsage.reduce((acc, item) => acc + item, 0) / threadsUsage.length;
    return round(inPercent ? avgThread * 100 : avgThread, precision);
};
export const getMedThread = (inPercent = true, precision = 5, threadsUsage = getThreadUsage()) => {
    threadsUsage.sort((a, b) => a - b);
    const medThread = threadsUsage[Math.floor(threadsUsage.length / 2)];
    return round(inPercent ? medThread * 100 : medThread, precision);
};
// CPU
export const getCpuUsage = (inPercent = true, precision = 5, endThreads = getThreadState()) => {
    const totalStart = startState.reduce((acc, cpu) => {
        acc.total += cpu.total;
        acc.idle += cpu.idle;
        return acc;
    }, { total: 0, idle: 0 });
    const totalEnd = endThreads.reduce((acc, cpu) => {
        acc.total += cpu.total;
        acc.idle += cpu.idle;
        return acc;
    }, { total: 0, idle: 0 });
    const totalDiff = totalEnd.total - totalStart.total;
    const idleDiff = totalEnd.idle - totalStart.idle;
    const cpuUsage = (totalDiff - idleDiff) / totalDiff;
    return round(inPercent ? cpuUsage * 100 : cpuUsage, precision);
};
export const isCpuBelow = (threshold = 50, endThreads = getThreadState()) => {
    return getCpuUsage(true, 5, endThreads) < threshold;
};
export const isCpuAbove = (threshold = 50, endThreads = getThreadState()) => {
    return !isCpuBelow(threshold, endThreads);
};
// Memory
const totalMemory = os.totalmem();
export const getTotalMemory = (inGB = false, precision = 0) => {
    return inGB ? round(totalMemory / 1024 / 1024 / 1024, precision) : totalMemory;
};
export const getUsedMemory = (inGB = false, precision = 0) => {
    let usedMemory = totalMemory - os.freemem();
    return inGB ? round(usedMemory / 1024 / 1024 / 1024, precision) : usedMemory;
};
export const getMemoryUsage = (inPercent = false, precision = 5) => {
    let memoryUsage = (getUsedMemory() / totalMemory);
    memoryUsage = inPercent ? memoryUsage * 100 : memoryUsage;
    return round(memoryUsage, precision);
};
export const isMemoryBelow = (threshold = 50) => {
    return getMemoryUsage(true) < threshold;
};
export const isMemoryAbove = (threshold = 50) => {
    return !isMemoryBelow(threshold);
};
