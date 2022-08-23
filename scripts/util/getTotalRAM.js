/**
 * Return total RAM available on all servers with root access
 */

/** @param {NS} ns */
export async function main(ns) {
    var totalRAM = 0;
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		totalRAM = totalRAM + await recurse(ns, target, visited);
	}

	ns.tprint(totalRAM);

	return totalRAM;
}

/** @param {NS} ns */
async function recurse(ns, target, visited) {
	if (visited.has(target)) {
		return;
	}

	if (!ns.hasRootAccess(target) && ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return;
	}

	visited.add(target);
	
	var serverRAM = await ns.getServerMaxRam(target);

	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		recurse(ns, neighbour, visited);
	}

	return serverRAM;
}