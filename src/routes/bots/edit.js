const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const { WEBSITE_BOTTAGS, WEBSITE_MAXSUMMARYLENGTH } = process.env;
const botTags = JSON.parse(WEBSITE_BOTTAGS);

const route = Router();

route.get("/:id", auth, async (req, res) => {
  const bot = await Bots.findOne(
    { botid: req.params.id },
    { Id: false, auth: false }
  );

  if (!bot) return res.render("404", { req });

  // Backward compaitibility
  let owners = [bot.owners.primary].concat(bot.owners.additional);
  if (String(bot.owners).startsWith("[")) {
    owners = String(bot.owners)
      .replace("[ '", "")
      .replace("' ]", "")
      .split("', '");
  }

  if (!owners.includes(req.user.id) && !req.user.staff)
    return res.render("403", { req });

  res.render("edit", {
    bot,
    botTags,
    WEBSITE_MAXSUMMARYLENGTH,
    req,
  });
});

module.exports = route;
