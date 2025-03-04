const session = require("express-session");
const passport = require("passport");

function authMiddleware(app){
    // Configure session
    app.use(session({
        secret: "MYSECRETKEY",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = {
    authMiddleware
}