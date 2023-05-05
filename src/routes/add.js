const { Router } = require("express");
const { auth } = require("@utils/discordApi");

const {
  web: {
    recaptchaV2: { siteKey },
  },
  botOptions: { botTags, maxSummaryLength },
} = require("@root/config.json");

const route = Router();

route.get("/", auth, async (req, res) => {
  res.render("add", {
    botTags,
    maxSummaryLength,
    siteKey,
    req,
  });
});

module.exports = route;
