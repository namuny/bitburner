/**
 * Traverse through servers to find coding contracts
 */


const EXTENSION = 'cct';

/** @param {NS} ns */
export async function main(ns) {
	var visited = new Set();
	var targets = ns.scan('home');
	visited.add('home');

	for (var target of targets) {
		await recurse(ns, target, visited);
	}
}

/** @param {NS} ns */
async function recurse(ns, target, visited) {
	if (visited.has(target)) {
		return;
	}

	const files = ns.ls(target, EXTENSION);

	if (files.length != 0) {
		ns.tprint(`Found coding contract(s) in ${target}`);
	}

	visited.add(target);
	
	var neighbours = ns.scan(target);
	for (var neighbour of neighbours) {
		if (visited.has(neighbour)) {
			continue;
		}
		await recurse(ns, neighbour, visited);
	}
}