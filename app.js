var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');
var Comment = require('./models/comment');


seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("campgrounds/landing");
});

app.get("/campgrounds", (req, res) => {
    //get all campgrounds from db
    Campground.find({}, (err, result) => {    // result here is all campgrounds from DB
        if (err) console.log(err);
        else res.render("campgrounds/index", { campgrounds: result });
    });
});

app.post("/campgrounds", (req, res) => {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
    //create new campground and save in database
    Campground.create(newCampground, (err, newCamp) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds");
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log("long query in show page" + foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//==========================COMMENTS ROUTES ====================================
app.get("/campgrounds/:id/comment/new", (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) console.log(err);
        else {
            res.render("comments/new", { campground: campground });
        }
    });

});

app.post("/campgrounds/:id/comment", (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })

        }
    });


    //redirect campground to show page
});

app.listen(3000, () => {
    console.log("server is on");
});