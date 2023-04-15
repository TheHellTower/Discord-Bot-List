require("module-alias/register");
const mongoose = require("mongoose");

const bot = require('@bot/index');
const App = require('@structures/app.js');
const { web: {port}, discord_client: {token}, mongo_url } = require("@root/config.json");


(async () => {
  console.log(mongo_url)
    mongoose.connect(`${mongo_url}`, { retryWrites: true, w: "majority" }).then(() => {
      console.log(`Connected to the database on`,`\x1b[34m\x1b[4m${mongo_url}\x1b[0m`);
    }).catch(() => {
      console.log("No DB ?");
    });
    let client = await bot.init(token);
    console.log(`Logged in as ` + `\x1b[34m\x1b[4m${client.user.tag}\x1b[0m`);
    await new App(client).listen(port || 8080);
    console.log(`Running on port ` + `\x1b[34m\x1b[4m${port || 80}\x1b[0m`);
})()