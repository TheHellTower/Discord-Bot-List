module.exports = class Event {
  constructor(client, name, options = {}) {
    this.name = name;
    this.client = client || this.client;
    this.type = options.once ? "once" : "on";
    // this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    this.emitter =
      (typeof options.emitter === "string"
        ? globalThis.TheHellTower.client[options.emitter]
        : options.emitter) || globalThis.TheHellTower.client;
  }

  async run(...args) {
    throw new Error(`The run method has not been implemented in ${this.name}`);
  }
};
