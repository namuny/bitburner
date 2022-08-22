/**
 * 1. Use DFS to traverse the server network
 * 2. Open all ports
 * 3. Kill all running scripts
 * 4. Move hack script
 * 5. Run hack script with the highest thread count
 */

const NUM_OPEN_PORTS = 3;
const SCRIPT = '/scripts/hack/hack.js';

/** @param {NS} ns */
export async function main(ns) {
	var scriptRam = ns.getScriptRam(SCRIPT);
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		var neighbours = ns.scan(target);

		for (var neighbour of neighbours) {
			await recurse(ns, neighbour, ['home'], visited, scriptRam);
		}
	}
}

/** @param {NS} ns */
async function recurse(ns, target, paths, visited, scriptRam) {
	if (visited.has(target)) {
		return;
	}

	if (ns.getServerNumPortsRequired(target) > NUM_OPEN_PORTS) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
		return;
	}

	ns.brutessh(target);
	ns.ftpcrack(target);
	ns.relaysmtp(target);
	ns.nuke(target);

	ns.killall(target);

	await ns.scp(SCRIPT, target, 'home');

	var serverRam = ns.getServerMaxRam(target);
	var numThreads = Math.floor(serverRam / scriptRam);
	
	if (numThreads > 0) {
		ns.exec(SCRIPT, target, numThreads);
	}

	// await ns.connect(target);
	// await ns.installBackdoor();
	visited.add(target);
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		var newPaths = [...paths, target];
		recurse(ns, neighbour, newPaths, visited, scriptRam)
		// await ns.connect(target);
	}
}