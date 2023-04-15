const Command = globalThis.TheHellTower.client.structures.command,
    { EmbedBuilder } = require('discord.js'),
    Bots = require("@models/bots"),
    
    { server: {mod_log_id, role_ids} } = require("@root/config.json");

const reasons = {
    "1": `Your bot was offline when we tried to verify it.`,
    "2": `Your bot is a clone of another bot`,
    "3": `Your bot responds to other bots`,
    "4": `Your bot doesn't have any/enough working commands. (Minimum: 7)`,
    "5": `Your bot has NSFW commands that work in non-NSFW marked channels`,
    "6": `Your bot doesn't have a working help command or commands list`
}
var modLog;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'remove',
            category: "Bots",
            aliases: ["delete"],
            description: "Remove a bot from the botlist",
            usage: '[Member:user]'
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

        if (!user || !user.bot) return message.channel.send(`You didn't ping a bot to remove.`)

        this.init();
        
        let bot = await Bots.findOne({ botid: user.id }, { _id: false });
        let owners = [bot.owners.primary].concat(bot.owners.additional)
        if(!owners.includes(message.author.id) && !message.member.roles.cache.has(globalThis.config.server.role_ids.bot_verifier)) return message.reply("Only DBL admin(s) or the respective bot owner(s) are allowed to remove this bot.");
        await Bots.updateOne({ botid: user.id }, { $set: { state: "deleted", owners: {primary: bot.owners.primary, additional: []} } });
        const botUser = await this.client.users.fetch(user.id);
        if (!bot) return message.channel.send(`Unknown Error. Bot not found.`)

        let e = new EmbedBuilder()
            .setTitle('Reasons')
            .setColor(0x6b83aa)
            .addFields({name: `Removing bot`, value: `${user}`})
        let cont = ``;
        for (let k in reasons) {
            let r = reasons[k];
            cont += ` - **${k}**: ${r}\n`
        }
        cont += `\nEnter a valid reason number or your own reason.`
        e.setDescription(cont)
        message.reply({embeds: [e]}).then(async (m) => {
            const mainAnswer = await m.channel
            .awaitMessages({
            filter: (m) => m.author.id === message.author.id,
            time: 20000,
            max: 1,
          })
          .catch((e) => {
            message.reply({
              content: "You ran out of time or an error happened !",
            });
          });
          
          if (mainAnswer.size) {
            var answerMessage = mainAnswer.first();
            answerMessage.delete();
            let r = answerMessage.content;
            if (parseInt(r)) {
                r = reasons[r]
                if (!r) return message.channel.send("Invalid reason number.")
            }

            e = new EmbedBuilder()
            .setTitle('Bot Removed')
            .addFields(
                { name: "Bot", value: `<@${bot.botid}>`, inline: true },
                { name: "Owner(s)", value: `${owners.map(x => x ? `<@${x}>` : "")}`, inline: true },
                { name: "Mod", value: `<@${message.author.id}>`, inline: true },
                { name: "Reason", value: `${r}`, inline: true },
            )
            .setThumbnail(botUser.displayAvatarURL({format: "png", size: 256}))
            .setTimestamp()
            .setColor(0xffaa00)
            modLog.send({embeds:[e]});

            let msg = await modLog.send(`${owners.map(x => x ? `<@${x}>` : "")}`);
            msg.delete();

            owners = await message.guild.members.fetch({user: owners})
            owners.forEach(o => {
                o.send(`Your bot ${bot.username} has been removed:\n>>> ${r}`).catch(() => {});
            });

            if (!message.client.users.cache.find(u => u.id === bot.botid).bot) return;
        try {
            message.guild.members.fetch(message.client.users.cache.find(u => u.id === bot.botid))
                .then(bot => {
                    bot.kick().then(() => {})
                        .catch(e => { console.log(e) })
                }).catch(e => { console.log(e) });
        } catch (e) { console.log(e) }
        
        return m.edit({content: `Removed <@${bot.botid}> Check <#${mod_log_id}>.`, embeds: []});
          }
        });
    }

    async init() {
        modLog = await this.client.channels.fetch(mod_log_id);
    }
};
