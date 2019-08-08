var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router({ mergeParams: true });   // mergeParams are used to pass the parameters to the path

//SIGN UP FORM ROUTE
router.get("/register", (req, res) => {
    res.render("register");
});

//SIGNUP ROUTE
router.post("/register", (req, res) => {
    console.log("inside register post route")
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, userRegistered) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to yelpCamp " + newUser.username);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM ROUTE
router.get("/login", (req, res) => {

    res.render("login");
});

//LOGIN ROUTE
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {
    });

//logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "successfully logged out");
    res.redirect("/campgrounds");
});

module.exports = router;