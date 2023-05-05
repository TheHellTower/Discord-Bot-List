const { Router } = require("express");
const path = require("path");

const route = Router();

route.get("/", async (req, res) => {
  res.set("Cache-Control", "no-store");

  let { theme } = req.cookies;

  theme = theme === undefined ? "dark" : theme;

  res.sendFile(path.join(_Dirname, `../dynamic/theme/${theme}.css`));
});

module.exports = route;
