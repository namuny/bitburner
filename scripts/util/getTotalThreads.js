/**
 * Return total threads available on all servers with root access
 */

 const NUM_OPEN_PORTS = 5;

/** @param {NS} ns */
export async function getTotalThreads(ns, scriptRAM) {
    var totalThreads = 0;
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		totalThreads = totalThreads + await recurse(ns, target, visited, scriptRAM);
	}

	ns.tprint(totalThreads);

	return totalThreads;
}

/** @param {NS} ns */
async function recurse(ns, target, visited, scriptRAM) {
	if (visited.has(target)) {
		return 0;
	}

	if (!ns.hasRootAccess(target) && ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return 0;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return 0;
	}

	visited.add(target);
	
	var maxRAM = await ns.getServerMaxRam(target);
	var threads = Math.floor(maxRAM / scriptRAM);
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		threads = threads + await recurse(ns, neighbour, visited, scriptRAM);
	}

	return threads;
}