const Bots = require("@models/bots");

const { WEBSITE_RATELIMIT } = process.env;

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.json({
      success: "false",
      error: "Authorization header not found.",
    });
  }

  const bot = await Bots.findOne({ botid: req.params.id }, { Id: false });
  if (!bot) return res.json({ success: "false", error: "Bot not found." });

  if (!bot.auth) {
    return res.json({
      success: "false",
      error: "Create a bot authorization token.",
    });
  }
  if (bot.auth !== auth) {
    return res.json({
      success: "false",
      error: "Incorrect authorization token.",
    });
  }

  if (bot.ratelimit && Date.now() - bot.ratelimit < WEBSITE_RATELIMIT * 1000)
    return res.json({ success: "false", error: "You are being ratelimited." });

  Bots.updateOne({ botid: req.params.id }, { ratelimit: Date.now() });
  return next();
};
