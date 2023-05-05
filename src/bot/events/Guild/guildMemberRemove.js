const Event = globalThis.TheHellTower.client.structures.event;
const Bots = require("@models/bots");
const {
  server: { id, modLogId },
} = require("@root/config.json");

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberRemove",
      type: "on",
    });
  }

  async run(member) {
    const bots = await Bots.find(
      { "owners.primary": member.user.id, state: { $ne: "deleted" } },
      { Id: false }
    );
    for (const bot of bots) {
      await Bots.updateOne(
        { botid: bot.botid },
        { $set: { state: "deleted" } }
      );
      try {
        const botMember = await this.client.guilds.cache
          .get(id)
          .members.fetch(bot.botid);
        botMember.kick();
        this.channels.cache
          .get(modLogId)
          .send(
            `<@${bot.botid}> has been deleted as <@${member.user.id}> (${member.user.tag}) has left.`
          );
      } catch (e) {}
    }
  }
};
