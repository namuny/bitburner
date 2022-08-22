/**
 * Delete servers that are below the specified RAM
 */

const RAM = 16384;

/** @param {NS} ns */
export async function main(ns) {
    var servers = ns.getPurchasedServers();

    for (var server of servers) {
        var serverRam = ns.getServerMaxRam(server);
        if (serverRam < RAM) {
            ns.tprint(`Deleting server ${server} because RAM of ${serverRam} is below specified threshold ${RAM}`);
            ns.killall(server);
            ns.deleteServer(server);
        }
    }
}