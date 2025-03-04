const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRY } = require("../config");

const router = express.Router();

// Google OAuth Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/"
    }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Google authentication failed" });
        }

        // Generate JWT
        const token = jwt.sign({ id: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        // Set JWT in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to `true` if using HTTPS
            sameSite: "Strict",
            maxAge: 3600000,
        });

        // Destroy the session
        req.session.destroy(() => {
            res.redirect("/dashboard"); // Redirect to the frontend
        });
    }
);

// Logout (clears JWT cookie)
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.logout(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

module.exports = router;