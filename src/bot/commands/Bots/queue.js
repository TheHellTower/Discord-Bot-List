const Command = globalThis.TheHellTower.client.structures.command,
    { EmbedBuilder } = require('discord.js'),
    Bots = require("@models/bots"),
    
    { server: {id} } = require("@root/config.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "queue",
            category: "Bots",
            aliases: ["q"],
            description: "Check how many bots are in queue",
            usage: ""
        });
    }

    async run(message) {
        let cont = "";
        let bots = await Bots.find({ state: "unverified" }, { _id: false })

        //No handling for a huge amount of bot ? Mmmmh...
        bots.forEach(bot => { cont += `<@${bot.botid}> : [Invite](https://discord.com/oauth2/authorize?client_id=${bot.botid}&scope=bot&guild_id=${id}&permissions=0)\n` })
        if (bots.length === 0) cont = "Queue is empty";

        let embed = new EmbedBuilder()
            .setTitle('Queue')
            .setColor(0x6b83aa)
            .setDescription(cont)
        return message.reply({embeds: [embed]});
    }
};