const TARGET = 'joesguns';

 /** @param {NS} ns */
export async function main(ns) {
	while(true) {
		await ns.grow(TARGET);
	}
}