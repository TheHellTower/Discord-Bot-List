const Event = globalThis.TheHellTower.client.structures.event;

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: "userUpdate",
      type: "on",
    });
  }

  async run(oldUser, newUser) {
    if (
      oldUser.bot &&
      oldUser.username !== newUser.username &&
      newUser.username
    ) {
      Bots.updateOne(
        { botid: newUser.id },
        { $set: { username: newUser.username } }
      );
    }
  }
};
