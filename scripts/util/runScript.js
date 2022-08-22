// TODO turn this into dynamic network mapping

const TARGETS = ['n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns',
'hong-fang-tea', 'harakiri-sushi', 'zer0', 'max-hardware', 'nectar-net', 'CSEC',
'iron-gym'];
const FILE = '/scripts/simple_hack/joesguns.js';

/** @param {NS} ns */
export async function main(ns) {
	var scriptRam = ns.getScriptRam(FILE);

	for (var target of TARGETS) {
		var serverRam = ns.getServerRam(target);
		var numThreads = Math.floor(serverRam / scriptRam);

		await ns.connect(target);
		await ns.run(FILE, numThreads);
	}
}