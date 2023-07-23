const { Router } = require("express");

const { SERVER_INVITE } = process.env;

const route = Router();

route.get("/", async (_, res) => {
  res.redirect(SERVER_INVITE);
});

module.exports = route;
