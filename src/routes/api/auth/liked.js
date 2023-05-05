const { Router } = require("express");
const bodyParser = require("body-parser");
const Users = require("@models/users");

const authApi = require("@utils/authApi");

const route = Router();
route.use(bodyParser.json({ limit: "50mb" }));

route.get("/:id", authApi, async (req, res) => {
  const unfiltered = await Users.find(
    { botliked: req.params.id },
    { Id: false, _V: false, botliked: false }
  );
  const users = [];
  for (const user of unfiltered) {
    if (user && Date.now() - user.time < 43200000) {
      users.push(user);
    }
  }
  return res.json({ success: "true", users });
});

module.exports = route;
