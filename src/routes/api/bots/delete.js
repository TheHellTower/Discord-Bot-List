const { Router } = require("express");
const bodyParser = require("body-parser");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");

const { SERVER_ADMINUSERS, SERVER_MODLOG, SERVER_ID } = process.env;

const route = Router();
route.use(bodyParser.urlencoded({ extended: true }));

route.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  const bot = await Bots.findOne({ botid: id }, { Id: false });

  if (!bot) return res.sendStatus(404);
  if (
    bot.owners.primary !== req.user.id &&
    !SERVER_ADMINUSERS.includes(req.user.id)
  )
    return res.sendStatus(403);

  await Bots.deleteOne({ botid: id });

  req.app
    .get("client")
    .channels.cache.get(SERVER_MODLOG)
    .send(`<@${req.user.id}> has deleted <@${bot.botid}>`);
  req.app
    .get("client")
    .guilds.cache.get(SERVER_ID)
    .members.fetch(id)
    .then((bot) => {
      bot.kick();
    })
    .catch(() => {});
  res.sendStatus(200);
});

module.exports = route;
