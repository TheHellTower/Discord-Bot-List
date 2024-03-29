const { Router } = require("express");
const { auth } = require("@utils/discordApi");
const checkFields = require("@utils/checkFields");
const sanitizeHtml = require("sanitize-html");
const Bots = require("@models/bots");

const { SERVER_MODLOG, SERVER_ROLE_BOTVERIFIER } = process.env;

const opts = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "nl",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "strike",
    "hr",
    "br",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "img",
    "s",
    "u",
  ],
  disallowedTagsMode: "discard",
  allowedAttributes: {
    a: ["href"],
    img: ["src"],
  },
  allowedSchemes: ["https"],
};

const route = Router();

Array.prototype.remove = function () {
  let what;
  const a = arguments;
  let L = a.length;
  let ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

route.post("/:id", auth, async (req, res) => {
  let resubmit = false;
  let check;

  try {
    check = await checkFields(req);
    if (!check.success) return res.json(check);
  } catch (e) {
    return res.json({ success: false, message: "Unknown error" });
  }
  const { bot, users } = check;
  const data = req.body;
  data.long = sanitizeHtml(data.long, opts);
  const owners = {
    primary: req.user.id,
    additional: users,
  };

  const original = await Bots.findOne({ botid: req.params.id });
  if (original && original.state !== "deleted") {
    return res.json({
      success: false,
      message: "Your bot already exists on the list.",
      button: { text: "Edit", url: `/bots/edit/${bot.id}` },
    });
  }
  if (original && original.state == "deleted") resubmit = true;

  if (resubmit) {
    await Bots.updateOne(
      { botid: req.params.id },
      {
        username: bot.username,
        invite: data.invite,
        description: data.description,
        long: data.long,
        prefix: data.prefix,
        state: "unverified",
        support: data.support,
        website: data.website,
        github: data.github,
        tags: data.tags,
        note: `${data.note || "No Note"}`,
        owners,
        nsfw: data.marknsfw === "true",
      }
    );
  } else {
    new Bots({
      username: bot.username,
      botid: req.params.id,
      logo: `https://cdn.discordapp.com/avatars/${req.params.id}/${bot.avatar}.png`,
      invite: data.invite,
      description: data.description,
      long: data.long,
      prefix: data.prefix,
      state: "unverified",
      support: data.support,
      website: data.website,
      github: data.github,
      tags: data.tags,
      note: `${data.note || "No Note"}`,
      owners,
      nsfw: data.marknsfw === "true",
    }).save();
  }
  try {
    await req.app
      .get("client")
      .channels.cache.find((c) => c.id === SERVER_MODLOG)
      .send(
        `<@${req.user.id}> ${resubmit ? "re" : ""}submitted <@${
          req.params.id
        }>: <@&${SERVER_ROLE_BOTVERIFIER}>`
      );
    return res.json({ success: true, message: "Your bot has been added" });
  } catch (e) {
    return res.json({ success: true, message: "Your bot has been added" });
  }
});

module.exports = route;
