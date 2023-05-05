const { Router } = require("express");
const getList = require("@utils/getList");

const {
  botOptions: { botTags },
} = require("@root/config.json");

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
