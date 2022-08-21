// TODO add hacking level constraints
// TODO open FTP port
// TODO create network map
// TODO use ns.connect to install backdoor

export async function main(ns) {
	var visited = new Set();
	var targets = await ns.scan('home');
	var map = new Map();
	visited.add('home');

	for (var target of targets) {
		if (visited.has(target)) {
			continue;
		}

		if (ns.getServerNumPortsRequired(target) > 1) {
			continue;
		}

		await ns.brutessh(target);
		await ns.ftpcrack(target);
		await ns.nuke(target);
		// await ns.installBackdoor(target);

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