const { Router } = require("express");
const https = require("https");
const { auth } = require("@utils/discordApi");
const Bots = require("@models/bots");
const Users = require("@models/users");

const { SERVER_LIKELOG } = process.env;

const route = Router();

route.patch("/:id", auth, async (req, res) => {
  const user = await Users.findOne({ userid: req.user.id });
  if (user && Date.now() - user.time < 43200000) {
    return res.json({ success: false, time: Date.now() - user.time });
  }

  const bot = await Bots.findOneAndUpdate(
    { botid: req.params.id },
    { $inc: { likes: 1 } }
  );
  await Users.updateOne(
    { userid: req.user.id },
    { $set: { time: Date.now(), botliked: req.params.id } },
    { upsert: true }
  );

  const userProfile = await req.app.get("client").users.fetch(req.user.id);

  // Discord Webhook
  const channel = await req.app
    .get("client")
    .channels.cache.get(SERVER_LIKELOG);
  let webhook = (await channel.fetchWebhooks()).first();
  if (!webhook) {
    webhook = await channel.createWebhook({ name: "DBL" });
  }
  await webhook.send({
    content: `<@${req.user.id}> (${userProfile.tag}) liked <@${req.params.id}>`,
  });

  // Custom webhook
  if (bot.webhook) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const req = https.request(bot.webhook, options, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    const postData = JSON.stringify({
      type: "like",
      bot: req.params.id,
      user: req.user.id,
      timestamp: new Date(),
    });

    req.write(postData);
    req.end();

    /* fetch(bot.webhook, { //node-fetch
      method: "POST",
      body: JSON.stringify({
        type: "like",
        bot: req.params.id,
        user: req.user.id,
        timestamp: new Date()
      }),
      headers: { 'Content-Type': 'application/json' }
    }) */
  }

  return res.json({ success: true });
});

module.exports = route;
