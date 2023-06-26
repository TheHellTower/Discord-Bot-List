const Command = globalThis.TheHellTower.client.structures.command;
const Bots = require("@models/bots");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "marknsfw",
      category: "Bots",
      aliases: ["nsfw", "toggle-nsfw", "togglensfw"],
      permissionLevel: 8,
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
      tag: user.tag.endsWith("#0") ? user.username : user.tag
    });
    
    if (!user || !user.bot)
      return message.reply({ content: "Ping a **bot** to mark as nsfw." });
    const bot = await Bots.findOne({ botid: user.id });
    const owners = [bot.owners.primary].concat(bot.owners.additional);
    if (
      !owners.includes(message.author.id) &&
      !message.member.roles.cache.has(
        globalThis.config.server.roleIds.botVerifier
      )
    ) {
      return message.reply(
        "Only DBL admin(s) or the respective bot owner(s) are allowed to update this bot."
      );
    }
    await Bots.updateOne({ botid: user.id }, { $set: { nsfw: !bot.nsfw } });
    message.reply({
      content: `👍 \`${user.tag}\` is ${
        bot.nsfw ? "not" : "now"
      } marked as NSFW${bot.nsfw ? " anymore" : ""}`,
    });
  }
};
