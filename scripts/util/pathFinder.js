/** @param {NS} ns */
 export async function main(ns) {
	var destination = ns.args[0];
	 var visited = new Set();
	 var targets = ns.scan('home');
	 visited.add('home');

	 var path = ['home'];

	 for (var target of targets) {
		 await recurse(ns, target, visited, path, destination);
	 }
 }
 
 /** @param {NS} ns */
 async function recurse(ns, target, visited, path, destination) {
	 if (visited.has(target)) {
		 return;
	 }

	 if (target === destination) {
		ns.tprint(`Found! ${path}, ${destination}`);
		return;
	}
 
	 visited.add(target);
	 var newPath = [...path];
	 newPath.push(target);
	 
	 var neighbours = ns.scan(target);
	 for (var neighbour of neighbours) {
		 if (visited.has(neighbour)) {
			 continue;
		 }
		 await recurse(ns, neighbour, visited, newPath, destination)
	 }
 }