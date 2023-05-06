const { Router } = require("express");

const route = Router();

route.get("/", globalThis.TheHellTower.rateLimits.theme, async (req, res) => {
  const { theme } = req.cookies;
  const l = "light";
  const d = "dark";
  res.cookie("theme", theme === undefined ? l : theme === d ? l : d);
  res.redirect(req.header("Referer") || "/");
});

module.exports = route;
