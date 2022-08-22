/**
 * This script attempts to find the optimal server to hack.
 * According to the [official tips](https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html#random-tips)
 * We shuold try to find a server with the highest max money, that requires under 1/3 hacking level.
 */

var bestServer = '';
var bestServerMaxMoney = 0;

/** @param {NS} ns */
export async function main(ns) {
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		await recurse(ns, target, visited);
	}

    ns.tprint(`The best server is ${bestServer} with max money of ${bestServerMaxMoney}`);
}

/** @param {NS} ns */
async function recurse(ns, target, visited) {
	if (visited.has(target)) {
		return;
	}

	if (!ns.hasRootAccess(target)) {
		return;
	}

	if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel() / 3) {
		return;
	}

	var maxMoney = ns.getServerMaxMoney(target);

    if (maxMoney <= bestServerMaxMoney) {
        return;
    }

	bestServerMaxMoney = maxMoney;
    bestServer = target;
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		recurse(ns, neighbour, visited);
	}
}