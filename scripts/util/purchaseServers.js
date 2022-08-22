const RAM = 16384;
const NEXT_RAM = 131072;
const SCRIPT_FILE = '/scripts/hack/hack.js';
const SLEEP_TIME_MILLIS = 10000;
const SERVER_NAME_PREFIX = 'namuny';

/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        await ns.sleep(SLEEP_TIME_MILLIS);
        
        const purchasedServers = await ns.getPurchasedServers();

        ns.print(`Purchased server count: ${purchasedServers.length}`);

        var ramPurchase = RAM;
        if (await ns.getPurchasedServerLimit() - purchasedServers.length <= 0) {
            ramPurchase = NEXT_RAM;
        }

        // If no money for ram, sleep 60 seconds
        if (await ns.getPurchasedServerCost(ramPurchase) > await ns.getServerMoneyAvailable('home')) {
            continue;
        }

        // If on to the next RAM, Delete a server with old ram
        var deletedServer = false;
        if (ramPurchase == NEXT_RAM) {
            for (var purchasedServer of purchasedServers) {
                if (ns.getServerMaxRam(purchasedServer) <= RAM) {
                    await ns.killall(purchasedServer);
                    deletedServer = await ns.deleteServer(purchasedServer);
                    break;
                }
            }
        }

        // If there are still no server capacity left at this point and we haven't deleted any servers, we've reached the end.
        if (await ns.getPurchasedServerLimit() - purchasedServers.length <= 0 && !deletedServer) {
            continue;
        }

        // Purchase server
        const serverName = SERVER_NAME_PREFIX + Date.now();
        const actualServerName = await ns.purchaseServer(serverName, ramPurchase);

        // Run scp script
        await ns.scp(SCRIPT_FILE, actualServerName, 'home');

        // Execute
        await ns.exec(SCRIPT_FILE, actualServerName, Math.floor(ramPurchase / ns.getScriptRam(SCRIPT_FILE)));
    }
}