const { Router } = require("express");

const route = Router();

const DISCORD_AVATAR_REGEX =
  /^https?:\/\/cdn\.discordapp\.com\/avatars\/\d+\/\w{32}$/;

route.get("/", async (req, res) => {
  const a = req.query.avatar;

  if (!DISCORD_AVATAR_REGEX.test(a))
    a =
      "https://cdn.discordapp.com/avatars/1049676795399647334/fcdbe7b563b4c7df67c99640ede84b7c.png";

  let got = await fetch(a);
  got = await got.buffer();
  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(got, "binary");
});

module.exports = route;
