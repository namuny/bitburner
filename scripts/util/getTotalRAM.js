/**
 * Return total RAM available on all servers with root access
 */

 const NUM_OPEN_PORTS = 5;

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
		return 0;
	}

	if (!ns.hasRootAccess(target) && ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return 0;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return 0;
	}

	visited.add(target);
	
	var serverRAM = await ns.getServerMaxRam(target);
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		serverRAM = serverRAM + await recurse(ns, neighbour, visited);
	}

	return serverRAM;
}