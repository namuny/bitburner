export async function main(ns) {
	var target = ns.args[0];
    const SECURITY_THRESHOLD = ns.getServerMinSecurityLevel(target) + 5;
    const MONEY_THRESHOLD = ns.getServerMaxMoney(target) * 0.75;

	while(true) {
		if (ns.getServerSecurityLevel(target) > SECURITY_THRESHOLD) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < MONEY_THRESHOLD) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}