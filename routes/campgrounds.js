var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var middleware = require("../middlewares");

router.get("/", (req, res) => {
    //get all campgrounds from db
    Campground.find({}, (err, result) => {    // result here is all campgrounds from DB
        if (err) console.log(err);
        else res.render("campgrounds/index", { campgrounds: result });
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    //get data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: desc, author: author };
    //create new campground and save in database
    Campground.create(newCampground, (err, newCamp) => {
        if (err) console.log(err);
        else {

            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {

        if (err) res.redirect("/campgrounds");

        else res.redirect("/campgrounds/" + req.params.id)
    })
    //redirect
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findOneAndDelete(req.params.id, err => {
        if (err) res.redirect("/campgrounds");
        else res.redirect("/campgrounds");
    });
});

module.exports = router;