const Event = globalThis.TheHellTower.client.structures.event;

const { SERVER_ROLE_BOT, SERVER_ROLE_UNVERIFIED } = process.env;

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberAdd",
      type: "on",
    });
  }

  async run(member) {
    if (member.user.bot) {
      member.roles.add(member.guild.roles.cache.get(SERVER_ROLE_BOT));
      member.roles.add(member.guild.roles.cache.get(SERVER_ROLE_UNVERIFIED));
    }
  }
};
