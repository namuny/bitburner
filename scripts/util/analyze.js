const NUM_OPEN_PORTS = 2;

/** @param {NS} ns */
export async function main(ns) {
	var visited = new Set();
	var targets = await ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		var neighbours = await ns.scan(target);

		for (var neighbour of neighbours) {
			await recurse(ns, neighbour, ['home'], visited);
		}
	}
}

/** @param {NS} ns */
async function recurse(ns, target, paths, visited) {
	if (visited.has(target)) {
		return;
	}

	if (ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return;
	}

	await ns.brutessh(target);
	await ns.ftpcrack(target);
	await ns.nuke(target);
	await ns.connect(target);
	await ns.installBackdoor();
	visited.add(target);
	
	var neighbours = await ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		var newPaths = [...paths, target];
		recurse(ns, neighbour, newPaths, visited)
		await ns.connect(target);
	}
}