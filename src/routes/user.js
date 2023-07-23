const { Router } = require("express");
const Bots = require("@models/bots");

const { SERVER_ADMINUSERS } = process.env;

const route = Router();

route.get("/:id", async (req, res) => {
  const user = await req.app
    .get("client")
    .users.fetch(req.params.id)
    .catch((_) => res.render("user/notfound", { userProfile: req.user, req }));
  if (!user) return;

  let bots = await Bots.find({}, { Id: false });
  bots = bots.filter((bot) =>
    [bot.owners.primary].concat(bot.owners.additional).includes(user.id)
  );  

  if (bots.length === 0)
    return res.render("user/notfound", { userProfile: req.user, req });

  res.render("user/index", {
    userProfile: user,
    cards: bots,
    admin: SERVER_ADMINUSERS.includes(req.params.id),
    moderator: user?.staff,
    req,
  });
});

module.exports = route;
