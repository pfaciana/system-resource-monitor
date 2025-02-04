import {
	getThreadState, getThreadUsage, getMinThread, getMaxThread, getAvgThread, getMedThread,
	isAnyThreadBelow, areAllThreadsBelow,
	getCpuUsage, isCpuBelow,
	getMemoryUsage, getUsedMemory, getTotalMemory,
	getPhysicalCoreCount, getLogicalCoreCount, getPlatform,
	delay,
} from './../src/index.js'


async function getCpuData() {
	console.clear()

	console.time('CORES')
	const state = getThreadState()
	await delay(100)
	const threads = getThreadUsage()
	console.timeEnd('CORES')

	console.time('getMinThread')
	console.log(getMinThread() < 50)
	console.timeEnd('getMinThread')
	console.time('isAnyThreadBelow')
	console.log(isAnyThreadBelow(50))
	console.timeEnd('isAnyThreadBelow')

	console.log(isAnyThreadBelow(10, state), ' | ', isCpuBelow(10, state), ' | ', areAllThreadsBelow(10, state))
	console.log(isAnyThreadBelow(20, state), ' | ', isCpuBelow(20, state))
	console.log(isAnyThreadBelow(30, state), ' | ', isCpuBelow(30, state))
	console.log(isAnyThreadBelow(40, state), ' | ', isCpuBelow(40, state))
	console.log(isAnyThreadBelow(50, state), ' | ', isCpuBelow(50, state))
	console.log(isAnyThreadBelow(60, state), ' | ', isCpuBelow(60, state))
	console.log(isAnyThreadBelow(70, state), ' | ', isCpuBelow(70, state))

	console.log('Min: ', getMinThread(true, 2, threads))
	console.log('Max: ', getMaxThread(true, 2, threads))
	console.log('Med: ', getMedThread(true, 2, threads))
	console.log('Avg: ', getAvgThread(true, 2, threads))

	console.time('CPU')
	console.log('CPU: ', getCpuUsage(true, 2))
	console.timeEnd('CPU')

	console.log('getTotalMemory: ', getTotalMemory(true))
	console.log('getUsedMemory: ', getUsedMemory(true))
	console.log('getMemoryUsage: ', getMemoryUsage())
	console.log('getPlatform: ', getPlatform())
	console.log('getPhysicalCoreCount: ', getPhysicalCoreCount())
	console.log('getLogicalCoreCount: ', getLogicalCoreCount())
}

getCpuData()

setInterval(getCpuData, 1000)