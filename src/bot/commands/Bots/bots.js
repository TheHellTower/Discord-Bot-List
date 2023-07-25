const Command = globalThis.TheHellTower.client.structures.command;
const { EmbedBuilder } = require("discord.js");
const Bots = require("@models/bots");

const { WEBSITE_DOMAINWITHPROTOCOL } = process.env;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "bots",
      category: "Bots",
      aliases: [],
      description: "Check the bot(s) someone own",
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
    user = Object.assign({}, user, {
      tag: user.tag.endsWith("#0") ? user.username : user.tag,
    });

    const bots = await Bots.find(
      {
        $or: [{ "owners.primary": user.id }, { "owners.additional": user.id }],
        state: { $ne: "deleted" },
      },
      { Id: false }
    );

    if (bots.length === 0)
      return message.channel.send(
        `\`${user.tag}\` has no bots. Add one: <${WEBSITE_DOMAINWITHPROTOCOL}/add>.`
      );
    let cont = "";
    let un = false;
    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      if (bot.state == "unverified") {
        un = true;
        cont += `~~<@${bot.botid}>~~\n`;
      } else cont += `<@${bot.botid}>\n`;
    }
    const e = new EmbedBuilder()
      .setTitle(`${user.tag}'s bots`)
      .setDescription(cont)
      .setColor(0x6b83aa);
    if (un) e.setFooter("Bots with strikethrough are unverified.");
    return message.reply({ embeds: [e] });
  }
};
