const Event = globalThis.TheHellTower.client.structures.event;

const {
  server: { roleIds },
} = require("@root/config.json");

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "guildMemberAdd",
      type: "on",
    });
  }

  async run(member) {
    if (member.user.bot) {
      member.roles.add(member.guild.roles.cache.get(roleIds.bot));
      member.roles.add(member.guild.roles.cache.get(roleIds.unverified));
    }
  }
};
