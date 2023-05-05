const { Router } = require("express");
const { Canvas, resolveImage } = require("canvas-constructor");
const Bots = require("@models/bots");

const {
  web: { domainWithProtocol },
  server: { id },
} = require("@root/config.json");

const path = require("path");

const route = Router();

route.get("/:id", async (req, res) => {
  const bot = await Bots.findOne({ botid: req.params.id }, { Id: false });
  if (!bot) return res.sendStatus(404);
  try {
    const owner = await req.app
      .get("client")
      .guilds.cache.get(id)
      .members.fetch(bot.owners.primary);
    const avatar = await resolveImage(bot.logo);
    const verified = await resolveImage(
      path.join(_Dirname, "./verified_badge.png")
    );
    const botUser = await req.app
      .get("client")
      .guilds.cache.get(globalThis.config.server.id)
      .members.fetch(req.params.id);

    const discordVerified = botUser.user.flags
      .toArray()
      .includes("VerifiedBot"); // VerifiedBot,BotHTTPInteractions

    const img = new Canvas(500, 250)
      .setColor("#404E5C")
      .printRectangle(0, 0, 500, 250)
      .setColor("#DCE2F9")
      .setTextFont("bold 35px sans")
      .printText(bot.username, 120, 75)
      .printRoundedImage(avatar, 30, 30, 70, 70, 20)
      .setTextAlign("left")
      .setTextFont("bold 12px Verdana");
    if (bot.servers[bot.servers.length - 1]) {
      img.printText(
        `${bot.servers[bot.servers.length - 1].count} servers | ${
          bot.likes
        } ❤️`,
        30,
        125
      );
    }
    if (discordVerified) {
      img.printImage(verified, 420, 55);
    }
    img
      .printText(`Prefix: ${bot.prefix}`, 30, 145)
      .setTextFont("normal 15px Verdana")
      .printWrappedText(bot.description, 30, 175, 440, 15)

      .setTextFont("bold 12px sans-serif")
      .printText(owner.user.tag, 10, 245)
      .setTextAlign("right")
      .printText(domainWithProtocol, 490, 245);

    res.writeHead(200, {
      "Content-Type": "image/png",
    });
    res.end(await img.toBuffer(), "binary");
  } catch (e) {
    throw e;
    res.sendStatus(500);
  }
});

module.exports = route;
