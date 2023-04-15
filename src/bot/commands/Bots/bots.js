const Command = globalThis.TheHellTower.client.structures.command,
    { EmbedBuilder } = require('discord.js'),
    Bots = require("@models/bots"),
    
    {web: {domain_with_protocol}} = require("@root/config.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "bots",
            category: "Bots",
            aliases: [],
            description: "Check the bot(s) someone own",
            usage: '[User:user]'
        });
    }

    async run(message, args) {
        let user =
      message.mentions.users.size > 0
        ? message.guild.members.cache.get(message.mentions.users?.first().id)
        : args[0]
        ? await this.client.users.fetch(args[0])
        : message.guild.members.cache.get(message.author.id);
        user = user?.user ? user.user : user;

        let bots = await Bots.find({ $or: [{ "owners.primary": user.id },{ "owners.additional": user.id }], state: { $ne: "deleted" } }, { _id: false });

        if (bots.length === 0) return message.channel.send(`\`${user.tag}\` has no bots. Add one: <${domain_with_protocol}/add/>.`)
        var cont = ``
        var un = false;
        for (let i = 0; i < bots.length; i++) {
            let bot = bots[i];
            if (bot.state == "unverified") {
                un = true
                cont += `~~<@${bot.botid}>~~\n`
            } else cont += `<@${bot.botid}>\n`
        }
        let e = new EmbedBuilder()
            .setTitle(`${user.username}#${user.discriminator}'s bots`)
            .setDescription(cont)
            .setColor(0x6b83aa)
        if (un) e.setFooter(`Bots with strikethrough are unverified.`)
        return message.reply({embeds: [e]});
    }

};