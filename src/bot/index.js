const {
  Client,
  GatewayIntentBits,
  ActivityType,
  Collection,
} = require("discord.js");

const {
  server: {
    roleIds: { botVerifier },
  },
  discordClient: { prefix },
} = require("@root/config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});
const Utils = new (require("./Utils"))(client);

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.structures = {
  command: require("./Structures/Command.js"),
  event: require("./Structures/Event.js"),
};

globalThis.TheHellTower = { client: null };

// Bot Status
client.once("ready", () => {
  client.user.setActivity("Bots", { type: ActivityType.Watching });
  globalThis.config = require("@root/config.json");
});

module.exports.init = async (token) => {
  client.userBaseDirectory = __dirname;
  globalThis.TheHellTower.client = client;
  Utils.loadCommands();
  Utils.loadEvents();
  await client.login(token);
  return client;
};
