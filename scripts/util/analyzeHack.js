/**
 * 1. Use DFS to traverse the server network
 * 2. Open all ports
 * 3. Kill all running scripts
 * 4. Move hack script
 * 5. Run hack script with the highest thread count
 */

const NUM_OPEN_PORTS = 5;
const SCRIPT = '/scripts/hack/hack.js';

/** @param {NS} ns */
export async function main(ns) {
	var scriptRam = ns.getScriptRam(SCRIPT);
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		await recurse(ns, target, visited, scriptRam);
	}
}

/** @param {NS} ns */
async function recurse(ns, target, visited, scriptRam) {
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
	
	if (numThreads > 0) {
		ns.exec(SCRIPT, target, numThreads);
	}

	visited.add(target);
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		recurse(ns, neighbour, visited, scriptRam)
	}
}