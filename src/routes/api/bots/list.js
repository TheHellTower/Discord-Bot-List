const { Router } = require("express");
const getList = require("@utils/getList.js");
const noAvatar = require("@utils/noAvatar");

const route = Router();

route.get("/", async (req, res) => {
  var bots = await getList();
  await Promise.all(bots.map((bot) => noAvatar(req.app.get("client"), [bot])));
  res.json(bots);
});

module.exports = route;
