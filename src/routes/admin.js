const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const noAvatar = require("@utils/noAvatar");

const { SERVER_ID } = process.env;

const route = Router();

route.get("/", auth, async (req, res) => {
  if (!req.user.staff) return res.render("403", { req });
  let bots = await Bots.find({ state: "unverified" }, { Id: false });
  if (bots == "") bots = null;

  if(bots != null)
    await Promise.all(bots.map((bot) => noAvatar(req.app.get("client"), [bot])));

  res.render("admin", {
    bots,
    SERVER_ID,
    req,
  });
});

module.exports = route;
