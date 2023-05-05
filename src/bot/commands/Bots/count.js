const Command = globalThis.TheHellTower.client.structures.command;
const Bots = require("@models/bots");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "count",
      category: "Bots",
      aliases: ["list", "botcount", "bot-count"],
      description: "Check how many bots there are in the list.",
    });
  }

  async run(message) {
    let bots = await Bots.find({}, { Id: false });
    bots = bots.filter((bot) => bot.state !== "deleted");
    if (bots.length === 1)
      message.reply({ content: "There is `1` bot in the list." });
    else {
      message.reply({
        content: `There are \`${bots.length}\` bots in the list.`,
      });
    }
  }
};
