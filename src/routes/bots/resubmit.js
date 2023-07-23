const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const { WEBSITE_BOTTAGS, WEBSITE_MAXDESCRIPTIONLENGTH } = process.env;
const botTags = JSON.parse(WEBSITE_BOTTAGS);

const route = Router();

route.get("/:id", auth, async (req, res) => {
  const bot = await Bots.findOne({ botid: req.params.id }, { Id: false });

  if (!bot) return res.render("404", { req });
  if (bot.state !== "deleted") return res.render("404", { req });

  res.render("resubmit", {
    bot,
    user: req.user,
    botTags,
    WEBSITE_MAXDESCRIPTIONLENGTH,
    req,
  });
});

module.exports = route;
