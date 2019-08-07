var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router({ mergeParams: true });   // mergeParams are used to pass the parameters to the path

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    console.log("inside register post route")
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, userRegistered) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});



router.get("/login", (req, res) => {

    res.render("login");
});

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