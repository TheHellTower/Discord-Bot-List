const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const {
  server: { adminUserIds },
} = require("@root/config.json");

const route = Router();
const noAvatar = require("@utils/noAvatar");

route.get("/", auth, async (req, res) => {
  const user = await req.app.get("client").users.fetch(req.user.id);
  if (!user) return res.render("user/notfound", { user: req.user, req });

  let bots = await Bots.find({}, { Id: false });
  bots = bots.filter((bot) => {
    // Backward compaitibility
    let owners = [bot.owners.primary].concat(bot.owners.additional);
    if (String(bot.owners).startsWith("[")) {
      owners = String(bot.owners)
        .replace("[ '", "")
        .replace("' ]", "")
        .split("', '");
    }
    return owners.includes(user.id);
  });

  await Promise.all(bots.map((bot) => noAvatar(req.app.get("client"), [bot])));
 
  res.render("user/me", {
    userProfile: user,
    cards: bots,
    admin: adminUserIds.includes(user.id),
    moderator: req.user.staff,
    req,
  });
});

module.exports = route;
