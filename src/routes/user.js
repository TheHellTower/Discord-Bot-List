const { Router } = require("express");
const Bots = require("@models/bots");

const {
  server: { adminUserIds },
} = require("@root/config.json");

const route = Router();

route.get("/:id", async (req, res) => {
  const user = await req.app
    .get("client")
    .users.fetch(req.params.id)
    .catch((_) => res.render("user/notfound", { userProfile: req.user, req }))
    //.catch((_) => res.render("404", { req }));
  if (!user) return;

  let bots = await Bots.find({}, { Id: false });
  bots = bots.filter((bot) =>
    [bot.owners.primary].concat(bot.owners.additional).includes(user.id)
  );

  console.log(bots.length);
  console.log(req.user)
  console.log(user)
  

  if (bots.length === 0)
    return res.render("user/notfound", { userProfile: req.user, req });

  res.render("user/index", {
    userProfile: user,
    cards: bots,
    admin: adminUserIds.includes(req.params.id),
    moderator: user?.staff,
    req,
  });
});

module.exports = route;
