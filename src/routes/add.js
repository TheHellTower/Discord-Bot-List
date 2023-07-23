const { Router } = require("express");
const { auth } = require("@utils/discordApi");

const { WEBSITE_BOTTAGS, WEBSITE_MAXSUMMARYLENGTH } = process.env;
const botTags = JSON.parse(WEBSITE_BOTTAGS);

const route = Router();

route.get("/", auth, async (req, res) => {
  res.render("add", {
    botTags,
    WEBSITE_MAXSUMMARYLENGTH,
    req
  });
});

module.exports = route;
