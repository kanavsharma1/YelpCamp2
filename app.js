var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');


seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req, res) => {
    //get all campgrounds from db
    Campground.find({}, (err, result) => {    // result here is all campgrounds from DB
        if (err) console.log(err);
        else res.render("index", { campgrounds: result });
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
    res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: foundCampground });
        }
    });
});

app.listen(3000, () => {
    console.log("server is on");
});