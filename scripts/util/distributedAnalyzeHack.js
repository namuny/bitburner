import { findOptimalServers } from '/scripts/util/findOptimalServers.js';
import { distributedHack } from '/scripts/util/distributedHack';
import { getTotalThreads } from '/scripts/util/getTotalThreads';

/**
 * 1. Find all viable servers and their max money
 * 2. Find total number of threads available across all distributed servers
 * 3. Find how many threads to provide to each target
 * 4. Run
 */

const SCRIPT = '/scripts/hack/hack.js';

/** @param {NS} ns */
export async function main(ns) {
	var scriptRAM = ns.getScriptRam(SCRIPT);
	var totalThreads = await getTotalThreads(ns, scriptRAM);
	var optimalServers = await findOptimalServers(ns, scriptRAM);
	
	// Total money
	var totalMoney = 0;
	for (var server of optimalServers) {
		totalMoney += server.maxMoney;
	}

	ns.tprint(`totalThreads: ${totalThreads}`);
	ns.tprint(`totalMoney: ${totalMoney}`);

	var moneyPerThread = totalMoney / totalThreads;

	var targetServerToThreads = [];

	for (server of optimalServers) {
		var targetServerToThread = {
			...server,
			allocatedThreadCount: Math.floor(server.maxMoney / moneyPerThread)
		};

		ns.tprint(`Allocated ${targetServerToThread.allocatedThreadCount} threads to ${server.name}`);

		targetServerToThreads.push(targetServerToThread);
	}

	await distributedHack(ns, targetServerToThreads);
}
