const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const {
  web: {
    recaptchaV2: { siteKey },
  },
  botOptions: { botTags, maxSummaryLength },
} = require("@root/config.json");

const route = Router();

route.get("/:id", auth, async (req, res) => {
  const bot = await Bots.findOne({ botid: req.params.id }, { Id: false });

  if (!bot) return res.render("404", { req });
  if (bot.state !== "deleted") return res.render("404", { req });

  res.render("resubmit", {
    bot,
    user: req.user,
    botTags,
    maxSummaryLength,
    siteKey,
    req,
  });
});

module.exports = route;
