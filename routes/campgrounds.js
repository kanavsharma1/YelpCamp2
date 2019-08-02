var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');





router.get("/", (req, res) => {
    //get all campgrounds from db
    Campground.find({}, (err, result) => {    // result here is all campgrounds from DB
        if (err) console.log(err);
        else res.render("campgrounds/index", { campgrounds: result });
    });
});

router.post("/", isLoggedIn, (req, res) => {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author };

    //create new campground and save in database
    Campground.create(newCampground, (err, newCamp) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds");
    });
});

router.get("/new", isLoggedIn, (req, res) => {
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
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) res.redirect("/campgrounds");
        else res.render("campgrounds/edit", { campground: foundCampground });
    });

});

//UPDATE ROUTE
router.put("/:id", (req, res) => {
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        console.log("under find and update query")
        if (err) res.redirect("/campgrounds");
        else res.redirect("/campgrounds/" + req.params.id)
    })
    //redirect
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}


module.exports = router;