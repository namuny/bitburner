import { findOptimalServers } from '/scripts/util/findOptimalServers.js';
import { targetHack } from '/scripts/util/targetHack';
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
	var optimalServers = await findOptimalServers(ns);
	
	// Total money
	var totalMoney = 0;
	for (var server of optimalServers) {
		totalMoney += server.maxMoney;
	}

	ns.tprint(`totalThreads: ${totalThreads}`);
	ns.tprint(`totalMoney: ${totalMoney}`);

	var moneyPerThread = totalMoney / totalThreads;

	// TODO Get server to thread count mapping
	// TODO Get total thread count from the above
	// TODO Call targetHack script with source server and target server and thread count
	// TODO ...

	for (var server of optimalServers) {
		var threads = Math.floor(server.maxMoney / moneyPerThread);
		if (threads <= 0) {
			continue;
		}

		ns.tprint(`Server: ${server.name}, maxMoney: ${server.maxMoney}, threads: ${threads}`);
		analyzeHack(ns)
	}
}
