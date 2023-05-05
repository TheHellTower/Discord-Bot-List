const { Router } = require("express");

const route = Router();

route.get("/", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(
        `\n==========LOGOUT==========\n${err.toString()}\n==========LOGOUT==========\n`
      );
    }
  });
  res.redirect("/");
});

module.exports = route;
