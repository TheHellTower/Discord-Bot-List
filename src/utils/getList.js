const Bots = require("@models/bots");

module.exports = async () => {
  const bots = await Bots.find(
    { state: { $ne: "deleted" } },
    {
      Id: false,
      auth: false,
      _V: false,
      addedAt: false,
    }
  );
  bots.sort((a, b) => b.likes - a.likes);
  return bots.map((x) => {
    if (x.servers && x.servers[x.servers.length - 1]) {
      x.servers = x.servers[x.servers.length - 1].count;
    } else x.servers = null;
    return x;
  });
};
