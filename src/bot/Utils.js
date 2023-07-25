const path = require("path");
const { promisify } = require("util");
const { glob } = require("glob");

const Command = require("./Structures/Command.js");
const Event = require("./Structures/Event.js");

module.exports = class Util {
  constructor(client) {
    this.client = client;
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  async loadCommands() {
    return glob.sync(`${this.directory}bot/commands/**/*.js`).map(commandFile => {
      delete require.cache[require.resolve(commandFile)];
      const { name } = path.parse(commandFile);
      const File = require(commandFile);
      if (!this.isClass(File)) {
        throw new TypeError(`Command ${name} doesn't export a class.`);
      }
      const command = new File(this.client, name.toLowerCase());
      if (!(command instanceof Command)) {
        throw new TypeError(`Command ${name} doesnt belong in Commands.`);
      }
      globalThis.TheHellTower.client.commands.set(command.name, command);
      if (command.aliases.length) {
        for (const alias of command.aliases) {
          if (!globalThis.TheHellTower.client.aliases.has(alias)) {
            globalThis.TheHellTower.client.aliases.set(alias, command.name);
          }
        }
      }
    });
  }

  async loadEvents() {
    return glob.sync(`${this.directory}bot/events/**/*.js`).map(eventFile => {
      delete require.cache[require.resolve(eventFile)];
        const { name } = path.parse(eventFile);
        const File = require(eventFile);
        if (!this.isClass(File)) {
          throw new TypeError(`Event ${name} doesn't export a class!`);
        }
        const event = new File(this.client, name);
        if (!(event instanceof Event)) {
          throw new TypeError(`Event ${name} doesn't belong in Events`);
        }
        globalThis.TheHellTower.client.events.set(event.name, event);
        try {
          event.emitter[event.type](name, (...args) => event.run(...args));
        } catch {
          //
        }
    });
  }
};
