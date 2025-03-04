const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL} = require("../config")
const { Participant } = require("../DB/index"); 

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await Participant.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await Participant.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        password: null,  // No password since it's OAuth
                        isOAuthUser: true,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user ID into the session(saving the user data in the session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user ID from the session(Retrieving the user data)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Participant.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
