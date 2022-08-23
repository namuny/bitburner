import { findOptimalServers } from './findOptimalServers';
import { analyzeHack } from './analyzeHack';

/**
 * 1. Find all viable servers and their max money
 * 2. Find total number of threads available across all distributed servers
 * 3. Find how many threads to provide to each target
 * 4. Run
 */

const NUM_OPEN_PORTS = 5;
const SCRIPT = '/scripts/hack/hack.js';

/** @param {NS} ns */
export async function main(ns) {
	var scriptRam = ns.getScriptRam(SCRIPT);


	

	var serverRam = ns.getServerMaxRam(target);
	var numThreads = Math.floor(serverRam / scriptRam);
	
	if (numThreads > 0) {
		ns.exec(SCRIPT, target, numThreads);
	}
}
