const Event = globalThis.TheHellTower.client.structures.event;

module.exports = class extends Event {
    constructor(...args) {
        super(...args, {
          name: "log",
          type: "on"
        });
    }

    async run() {}
    init() {}
};