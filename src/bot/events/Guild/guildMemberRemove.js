const Event = globalThis.TheHellTower.client.structures.event;
const Bots = require("@models/bots");

const { SERVER_ID, SERVER_MODLOG } = process.env;

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberRemove",
      type: "on",
    });
  }

  async run(member) {
    member = Object.assign({}, member, {
      tag: member.user.tag.endsWith("#0") ? member.user.username : member.user.tag
    });
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
          .get(SERVER_ID)
          .members.fetch(bot.botid);
        botMember.kick();
        this.channels.cache
          .get(SERVER_MODLOG)
          .send(
            `<@${bot.botid}> has been deleted as <@${member.user.id}> (${member.user.tag}) has left.`
          );
      } catch (e) {}
    }
  }
};
