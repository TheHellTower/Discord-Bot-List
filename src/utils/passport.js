const { Strategy } = require("passport-discord");
const passport = require("passport");

const { WEBSITE_DOMAINWITHPROTOCOL, BOT_ID, BOT_SECRET } = process.env;

const scopes = ["identify"];

passport.use(
  new Strategy(
    {
      clientID: BOT_ID,
      clientSecret: BOT_SECRET,
      callbackURL: `${WEBSITE_DOMAINWITHPROTOCOL}/api/callback`,
      scope: scopes,
    },
    (accessToken, refreshToken, profile, cb) => cb("", profile)
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
