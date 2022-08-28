/**
 * Traverse through servers to find:
 * * .txt
 * * .cct
 * * .lit
 * And copy them to local machine
 */


const TEXT = 'txt';
const LITERATURE = 'lit';

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

	const files = [];
	files.push(...ns.ls(target, TEXT));
	files.push(...ns.ls(target, LITERATURE));

	if (files.length != 0) {
		await ns.scp(files, 'home', target);
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