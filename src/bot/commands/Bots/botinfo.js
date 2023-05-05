const Command = globalThis.TheHellTower.client.structures.command;
const { EmbedBuilder } = require("discord.js");
const Bots = require("@models/bots");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "botinfo",
      category: "Bots",
      aliases: ["bot-info", "info"],
      description: "Check a bot info.",
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

    if (!user || !user.bot)
      return message.reply({ content: "Ping a **bot** to get info about." });
    if (user.id === message.client.user.id)
      return message.channel.send("-_- NoZ");

    const bot = await Bots.findOne({ botid: user.id }, { Id: false });
    const owners = [bot.owners.primary].concat(bot.owners.additional);
    if (!bot) return message.reply({ content: "Bot not found." });
    let servers;
    if (bot.servers[bot.servers.length - 1]) {
      servers = bot.servers[bot.servers.length - 1].count;
    } else servers = null;
    const botUser = await this.client.users.fetch(user.id);
    if (
      bot.logo !==
      `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`
    ) {
      await Bots.updateOne(
        { botid: user.id },
        {
          $set: {
            logo: `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`,
          },
        }
      );
    }
    const e = new EmbedBuilder();
    e.setColor(0x6b83aa);
    e.setAuthor({
      name: bot.username,
      iconURL: botUser.displayAvatarURL({ dynamic: true }),
    });
    e.setDescription(bot.description);
    e.addFields(
      { name: "Prefix", value: `${bot.prefix}`, inline: true },
      {
        name: "Support Server",
        value: `[Click Here](${bot.support})`,
        inline: true,
      },
      { name: "Website", value: `[Click Here](${bot.website})`, inline: true },
      { name: "GitHub", value: `[Click Here](${bot.github})`, inline: true },
      { name: "Likes", value: `${bot.likes} Likes`, inline: true },
      { name: "Server Count", value: `${servers || 0} Servers`, inline: true },
      {
        name: "Owner(s)",
        value: `${owners.map((x) => (x ? `<@${x}>` : ""))}`,
        inline: true,
      },
      { name: "State", value: `${bot.state}`, inline: true }
    );
    return message.reply({ embeds: [e] });
  }
};
