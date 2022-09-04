/**
 * This script attempts to find the optimal server to hack.
 * According to the [official tips](https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html#random-tips)
 * We shuold try to find a server with the highest max money, that requires under 1/3 hacking level.
 */

var TARGET_SERVERS = [];
var DIVISION_FACTOR = 3;

/** @param {NS} ns */
export async function findOptimalServers(ns, scriptRam) {
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		await recurse(ns, target, visited, scriptRam);
	}

	TARGET_SERVERS.sort((a, b) => a.maxMoney - b.maxMoney);

    TARGET_SERVERS.forEach(server => ns.tprint(`Server: ${server.name} maxMoney: ${server.maxMoney}`));

	return TARGET_SERVERS;
}

/** @param {NS} ns */
async function recurse(ns, target, visited, scriptRam) {
	if (target.startsWith('namuny')) {
		return;
	}

	if (visited.has(target)) {
		return;
	}

	if (!ns.hasRootAccess(target)) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel() / DIVISION_FACTOR) {
		return;
	}

	var maxMoney = ns.getServerMaxMoney(target);
	var maxRam = ns.getServerMaxRam(target);
	var threadCount = Math.floor(maxRam / scriptRam);

	if (threadCount <= 0) {
		return;
	}

	TARGET_SERVERS.push({
		name: target,
		maxMoney: maxMoney,
		maxRam: maxRam,
		threadCount: threadCount
	});

	visited.add(target);
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		recurse(ns, neighbour, visited, scriptRam);
	}
}