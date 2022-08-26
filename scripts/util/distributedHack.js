const NUM_OPEN_PORTS = 5;
const SCRIPT = '/scripts/hack/targetHack.js';

/** @param {NS} ns */
export async function distributedHack(ns, optimalServers) {
	var scriptRam = ns.getScriptRam(SCRIPT);
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		await recurse(ns, target, visited, scriptRam, optimalServers);
	}
}

/** @param {NS} ns */
async function recurse(ns, target, visited, scriptRam, optimalServers) {
	if (visited.has(target)) {
		return;
	}

	if (!ns.hasRootAccess(target) && ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return;
	}

	ns.brutessh(target);
	ns.ftpcrack(target);
	ns.relaysmtp(target);
	ns.httpworm(target);
	ns.sqlinject(target);
	ns.nuke(target);

	ns.killall(target);

	await ns.scp(SCRIPT, target, 'home');

	var serverRam = ns.getServerMaxRam(target);
	var numThreads = Math.floor(serverRam / scriptRam);
	var shouldExit = false;

	while(numThreads > 0 && !shouldExit) {
		if (optimalServers.filter(s => s.allocatedThreadCount > 0).length == 0) {
			break;
		}

		for (var optimalServer of optimalServers) {
			if (numThreads <= 0) {
				break;
			}

			var threadsToAllocate = Math.min(optimalServer.allocatedThreadCount, numThreads);

			if (threadsToAllocate <= 0) {
				continue;
			}

			ns.tprint(`[${target}]: Allocating ${threadsToAllocate} threads to attack ${optimalServer.name}`);
			ns.exec(SCRIPT, target, threadsToAllocate, optimalServer.name);

			numThreads -= threadsToAllocate;
			optimalServer.allocatedThreadCount -= threadsToAllocate;

			// Reached the end
			if (optimalServers[optimalServers.length - 1] == optimalServer) {
				shouldExit = true;
			}
		}
	}

	visited.add(target);
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		recurse(ns, neighbour, visited, scriptRam, optimalServers)
	}
}