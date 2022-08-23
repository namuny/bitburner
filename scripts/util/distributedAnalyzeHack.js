import { findOptimalServers } from './findOptimalServers';
import { analyzeHack } from './analyzeHack';
import { getTotalThreads } from './getTotalThreads';

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
	var scriptRAM = ns.getScriptRam(SCRIPT);
	var totalRAM = await getTotalThreads(scriptRAM);
	var optimalServers = await findOptimalServers();
	var totalThreads = Math.floor(totalRAM / scriptRAM);
	
	// Total money

	// Total number of threads

	// 3


	// 4
}
