const TARGET = 'joesguns';

 /** @param {NS} ns */
export async function main(ns) {
    const SECURITY_THRESHOLD = ns.getServerMinSecurityLevel(TARGET) + 5;
    const MONEY_THRESHOLD = ns.getServerMaxMoney(TARGET) * 0.75;

	while(true) {
		if (ns.getServerSecurityLevel(TARGET) > SECURITY_THRESHOLD) {
			await ns.weaken(TARGET);
		} else if (ns.getServerMoneyAvailable(TARGET) < MONEY_THRESHOLD) {
			await ns.grow(TARGET);
		} else {
			await ns.hack(TARGET);
		}
	}
}