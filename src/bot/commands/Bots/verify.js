const Command = globalThis.TheHellTower.client.structures.command,
    { EmbedBuilder } = require('discord.js'),
    Bots = require("@models/bots"),
    
    { server: {mod_log_id, role_ids} } = require("@root/config.json");

var modLog;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "verify",
            category: "Bots",
            aliases: [],
            description: "Set a bot to verified.",
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

        if (!user || !user.bot) return message.channel.send(`Ping a **bot**.`);
        let bot = await Bots.findOne({botid: user.id}, { _id: false });

        let owners = [bot.owners.primary].concat(bot.owners.additional)
        if(!message.member.roles.cache.has(globalThis.config.server.role_ids.bot_verifier)) return message.reply("Only DBL admin(s) are allowed to verify bots.");

        this.init();

        const botUser = await this.client.users.fetch(user.id);
        if (bot.logo !== `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`)
            await Bots.updateOne({ botid: user.id }, {$set: {state: "verified", logo: `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png` }});
        else 
            await Bots.updateOne({ botid: user.id }, {$set: { state: "verified" } })
        
        let e = new EmbedBuilder()
            .setTitle('Bot Verified')
            .addFields(
                { name: "Bot", value: `<@${bot.botid}>`, inline: true },
                { name: "Owner(s)", value: `${owners.map(x => x ? `<@${x}>` : "")}`, inline: true },
                { name: "Mod", value: `<@${message.author.id}>`, inline: true }, 
            )
            .setThumbnail(botUser.displayAvatarURL({format: "png", size: 256}))
            .setTimestamp()
            .setColor(0x26ff00)
        modLog.send({embeds:[e]});
        let msg = await modLog.send(`${owners.map(x => x ? `<@${x}>` : "")}`);
        msg.delete();

        owners = await message.guild.members.fetch({user:owners})
        owners.forEach(o => {
            o.roles.add(message.guild.roles.cache.get(role_ids.bot_developer));
            o.send(`Your bot \`${bot.username}\` has been verified.`).catch(() => {});
        })
        message.guild.members.fetch(message.client.users.cache.find(u => u.id === bot.botid)).then(bot => {
            bot.roles.add([role_ids.bot, role_ids.verified]);
        })
        return message.reply({content: `Verified <@${bot.botid}> Check <#${mod_log_id}>.`, embeds: []});;
    }

    async init() {
        modLog = await this.client.channels.fetch(mod_log_id);
    }
};