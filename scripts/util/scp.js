const SCRIPT = '/scripts/hack/hack.js';

/** @param {NS} ns */
export async function main(ns) {
	var visited = new Set();
	var targets = await ns.scan('home');
	visited.add('home');
	
	for (var target of targets) {
		if (visited.has(target)) {
			continue;
		}
		
		await ns.scp(SCRIPT, target, 'home');
		visited.add(target);

		var neighbours = await ns.scan(target);

		for (var neighbour of neighbours) {
			if (visited.has(neighbour)) {
				continue;
			}

			targets.push(neighbour);
		}
	}
}