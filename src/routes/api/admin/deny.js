const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");
const { EmbedBuilder } = require("discord.js");

const route = Router();

const {
  server: { id, modLogId },
} = require("@root/config.json");

route.post("/:id", auth, async (req, res) => {
  if (!req.user.staff)
    return res.json({ success: false, message: "Forbidden" });

  // Check bot exists
  const bot = await Bots.findOne(
    { state: "unverified", botid: req.params.id },
    { Id: false }
  );
  if (!bot) return res.json({ success: false, message: "Bot not found" });

  const { reason } = req.body;

  // Update bot in database
  const botUser = await req.app.get("client").users.fetch(req.params.id);

  /* var botNotFound = await req.app.get('client').guilds.cache.get(globalThis.config.server.id).members.fetch(req.params.id).then(() => botNotFound = false).catch(() => botNotFound = true);
    if (botNotFound) return res.json({ success: false, message: 'Bot not found in the server' }); */

  await Bots.updateOne(
    { botid: req.params.id },
    {
      $set: {
        state: "deleted",
        likes: 0,
        servers: [],
        note: undefined,
        logo: `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png`,
      },
    }
  );

  // Send messages
  let owners = [bot.owners.primary].concat(bot.owners.additional);
  const modLog = await req.app.get("client").channels.cache.get(modLogId);
  const embed = new EmbedBuilder()
    .setTitle("Bot Denied")
    .addFields(
      { name: "Bot", value: `<@${bot.botid}>`, inline: true },
      {
        name: "Owner(s)",
        value: `${owners.map((x) => (x ? `<@${x}>` : ""))}`,
        inline: true,
      },
      { name: "Mod", value: `${req.user.username}`, inline: true },
      { name: "Reason", value: `${reason || "No Reason"}`, inline: true }
    )
    .setThumbnail(botUser.displayAvatarURL({ format: "png", size: 256 }))
    .setTimestamp()
    .setColor(0x26ff00);
  modLog.send({
    embeds: [embed],
  });
  const msg = await modLog.send(`${owners.map((x) => (x ? `<@${x}>` : ""))}`);
  msg.delete();

  // Update developer roles and send DM
  owners = await req.app
    .get("client")
    .guilds.cache.get(id)
    .members.fetch({ user: owners });
  owners.forEach((o) => {
    o.send(
      `Your bot \`${bot.username}\` has been denied:\n>>> ${reason}`
    ).catch(() => {});
  });

  // Kick bot
  req.app
    .get("client")
    .guilds.cache.get(id)
    .members.fetch(req.params.id)
    .then((member) => {
      if (member) member.kick();
    })
    .catch((_) => {});

  return res.json({ success: true });
});

module.exports = route;
