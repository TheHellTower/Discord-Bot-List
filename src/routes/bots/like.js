const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");
const Users = require("@models/users");

const {
  web: {
    recaptchaV2: { siteKey },
  },
} = require("@root/config.json");

const route = Router();

route.get("/:id", auth, async (req, res) => {
  const bot = await Bots.findOne(
    { botid: req.params.id },
    { Id: false, auth: false }
  );
  const users = await Users.findOne(
    { userid: req.user.id },
    { Id: false, auth: false }
  );
  if (!bot) return res.render("404"), { req };

  res.render("like", {
    bot,
    user: req.user,
    siteKey,
    users,
    req,
  });
});

module.exports = route;
