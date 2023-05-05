const Command = globalThis.TheHellTower.client.structures.command;
const { EmbedBuilder } = require("discord.js");
const Bots = require("@models/bots");

const {
  server: { id },
} = require("@root/config.json");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "queue",
      category: "Bots",
      aliases: ["q"],
      description: "Check how many bots are in queue",
      usage: "",
    });
  }

  async run(message) {
    let cont = "";
    const bots = await Bots.find({ state: "unverified" }, { Id: false });

    // No handling for a huge amount of bot ? Mmmmh...
    bots.forEach((bot) => {
      cont += `<@${bot.botid}> : [Invite](https://discord.com/oauth2/authorize?client_id=${bot.botid}&scope=bot&guild_id=${id}&permissions=0)\n`;
    });
    if (bots.length === 0) cont = "Queue is empty";

    const embed = new EmbedBuilder()
      .setTitle("Queue")
      .setColor(0x6b83aa)
      .setDescription(cont);
    return message.reply({ embeds: [embed] });
  }
};
