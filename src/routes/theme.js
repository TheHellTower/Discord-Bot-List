const { Router } = require("express");
const path = require("path");

const route = Router();

const ALLOWED_THEMES = ["dark", "light"];

route.get("/", globalThis.TheHellTower.rateLimits.theme, async (req, res) => {
  res.set("Cache-Control", "no-store");

  let { theme } = req.cookies;

  if(!ALLOWED_THEMES.includes(theme)) theme = "dark";

  theme = theme === undefined ? "dark" : theme;

  res.sendFile(path.join(__dirname, `../dynamic/theme/${theme}.css`));
});

module.exports = route;
