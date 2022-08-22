const RAM = 8192;
const SCRIPT_FILE = '/scripts/simple_hack/joesguns.js';
const SCP_FILE = '/scripts/util/scp.js';
const SLEEP_TIME_MILLIS = 60000;
const SCP_SLEEP_TIME_MILLIS = 10000;
const SERVER_NAME_PREFIX = 'namuny';

/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        await ns.sleep(SLEEP_TIME_MILLIS);
        const purchasedServers = await ns.getPurchasedServers();

        ns.print(`Purchased server count: ${purchasedServers.length}`);

        // If no available server space, sleep 60 seconds
        if (await ns.getPurchasedServerLimit() - purchasedServers.length <= 0) {
            continue;
        }

        // If no money for ram, sleep 60 seconds
        if (await ns.getPurchasedServerCost(RAM) > await ns.getServerMoneyAvailable('home')) {
            continue;
        }

        // Purchase server
        const serverName = SERVER_NAME_PREFIX + purchasedServers.length;
        const actualServerName = await ns.purchaseServer(serverName, RAM);

        // Run scp script
        await ns.exec(SCP_FILE, 'home');

        await ns.sleep(SCP_SLEEP_TIME_MILLIS);

        // Execute
        await ns.exec(SCRIPT_FILE, actualServerName, Math.floor(RAM / ns.getScriptRam(SCRIPT_FILE)));
    }
}