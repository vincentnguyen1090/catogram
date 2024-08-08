const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/users");
const { storeReturnTo } = require("../middleware");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/cats");
  });
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Catogram!");
        res.redirect("/cats");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.post(
  "/login",
  storeReturnTo,
  // looks for req.body.username and req.body.password
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = res.locals.returnTo || "/cats";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
