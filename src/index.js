require("module-alias/register");
const mongoose = require("mongoose");

require("dotenv").config();

const bot = require("@bot/index");
const App = require("@structures/app.js");

const { MONGO_URI, WEBSITE_PORT, BOT_TOKEN, WEBSITE_RECAPTCHA_PUBLIC } = process.env;
const PORT = WEBSITE_PORT || 8080;

globalThis.WEBSITE_RECAPTCHA_PUBLIC = WEBSITE_RECAPTCHA_PUBLIC;

(async () => {
  mongoose
    .connect(MONGO_URI, { retryWrites: true, w: "majority" })
    .then(() => {
      console.log(
        "Connected to the database on",
        `\x1b[34m\x1b[4m${MONGO_URI}\x1b[0m`
      );
    })
    .catch(() => {
      console.error("No DB ?");
    });
  const client = await bot.init(BOT_TOKEN);
  console.log("Logged in as " + `\x1b[34m\x1b[4m${client.user.tag}\x1b[0m`);
  await new App(client).listen(PORT);
  console.log("Running on port " + `\x1b[34m\x1b[4m${PORT}\x1b[0m`);
})();
