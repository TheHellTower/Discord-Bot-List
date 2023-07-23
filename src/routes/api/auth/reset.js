const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const create = require("@utils/createAuth.js");
const Bots = require("@models/bots");

const { SERVER_ADMINUSERS } = process.env;

const route = Router();

route.get("/:id", auth, async (req, res) => {
  const bot = await Bots.findOne({ botid: req.params.id }, { Id: false });
  if (
    ![bot.owners.primary].concat(bot.owners.additional).includes(req.user.id) &&
    !SERVER_ADMINUSERS.includes(req.user.id)
  )
    return res.json({ success: false, error: "Bot owner is not user." });

  const newAuthCode = create(20);
  await Bots.updateOne(
    { botid: req.params.id },
    { $set: { auth: newAuthCode } }
  );

  res.json({ success: true, auth: newAuthCode });
});

module.exports = route;
