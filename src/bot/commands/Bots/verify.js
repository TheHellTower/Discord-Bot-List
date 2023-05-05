const Command = globalThis.TheHellTower.client.structures.command;
const { EmbedBuilder } = require("discord.js");
const Bots = require("@models/bots");

const {
  server: { modLogId, roleIds },
} = require("@root/config.json");

let modLog;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "verify",
      category: "Bots",
      aliases: [],
      description: "Set a bot to verified.",
      usage: "[User:user]",
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

    if (!user || !user.bot) return message.channel.send("Ping a **bot**.");
    const bot = await Bots.findOne({ botid: user.id }, { Id: false });

    let owners = [bot.owners.primary].concat(bot.owners.additional);
    if (
      !message.member.roles.cache.has(
        globalThis.config.server.roleIds.botVerifier
      )
    )
      return message.reply("Only DBL admin(s) are allowed to verify bots.");

    this.init();

    const botUser = await this.client.users.fetch(user.id);
    if (
      bot.logo !==
      `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`
    ) {
      await Bots.updateOne(
        { botid: user.id },
        {
          $set: {
            state: "verified",
            logo: `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`,
          },
        }
      );
    } else {
      await Bots.updateOne({ botid: user.id }, { $set: { state: "verified" } });
    }

    const e = new EmbedBuilder()
      .setTitle("Bot Verified")
      .addFields(
        { name: "Bot", value: `<@${bot.botid}>`, inline: true },
        {
          name: "Owner(s)",
          value: `${owners.map((x) => (x ? `<@${x}>` : ""))}`,
          inline: true,
        },
        { name: "Mod", value: `<@${message.author.id}>`, inline: true }
      )
      .setThumbnail(botUser.displayAvatarURL({ format: "png", size: 256 }))
      .setTimestamp()
      .setColor(0x26ff00);
    modLog.send({ embeds: [e] });
    const msg = await modLog.send(`${owners.map((x) => (x ? `<@${x}>` : ""))}`);
    msg.delete();

    owners = await message.guild.members.fetch({ user: owners });
    owners.forEach((o) => {
      o.roles.add(message.guild.roles.cache.get(roleIds.botDeveloper));
      o.send(`Your bot \`${bot.username}\` has been verified.`).catch(() => {});
    });
    message.guild.members
      .fetch(message.client.users.cache.find((u) => u.id === bot.botid))
      .then((bot) => {
        bot.roles.add([roleIds.bot, roleIds.verified]);
      });
    return message.reply({
      content: `Verified <@${bot.botid}> Check <#${modLogId}>.`,
      embeds: [],
    });
  }

  async init() {
    modLog = await this.client.channels.fetch(modLogId);
  }
};
