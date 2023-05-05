const { Router } = require("express");
const passport = require("passport");

const route = Router();

route.get(
  "/",
  passport.authenticate("discord", { scope: ["identify"], prompt: "consent" }),
  (req, res) => {}
);

module.exports = route;
