const { Router } = require("express");
const getList = require("@utils/getList");

const { WEBSITE_BOTTAGS } = process.env;
const botTags = JSON.parse(WEBSITE_BOTTAGS);

const route = Router();

route.get("/:tag", async (req, res) => {
  const { tag } = req.params;
  if (botTags.includes(tag)) {
    let bots = await getList();
    bots = bots.filter((bot) => {
      let { tags } = bot;
      if (!tags) {
        tags = botTags.filter((t) => t !== tag);
      }
      return tags.includes(tag);
    });
    if (bots == "") {
      bots = null;
    }

    res.render("tag", {
      cards: bots,
      tag,
      req,
    });
  } else {
    res.render("404");
  }
});

module.exports = route;
