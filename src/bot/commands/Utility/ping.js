const Command = globalThis.TheHellTower.client.structures.command;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            category: "Utility",
            aliases: ["pong", "latency"],
            description: "Check the bot's latency",
            usage: ""
        });
    }

    async run(message, [...params]) {
        let now = Date.now()
        let m = await message.reply(`Pinging...`);
        m.edit(`Pong! \`${Date.now() - now}\`ms`)
    }

};