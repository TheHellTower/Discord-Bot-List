const { Strategy } = require("passport-discord");
const passport = require("passport");

const {
  web: { domainWithProtocol },
  discordClient: { id, secret },
} = require("@root/config.json");

const scopes = ["identify"];

passport.use(
  new Strategy(
    {
      clientID: id,
      clientSecret: secret,
      callbackURL: `${domainWithProtocol}/api/callback`,
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
