var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true });

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

var campgrounds = [
    { name: "salmon creek", image: "" },
    { name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEtom84s-GfoGX2kQteC6XPoznI20buiV9vXWAWWIz1V4dhCX" },
    { name: "Mountain goats", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-1pnGqlT-YQVAySfjjvasbOl4ezGQKzS5bx3QXO0J5DgUQDcY" },
    { name: "salmon creek", image: "" },
    { name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEtom84s-GfoGX2kQteC6XPoznI20buiV9vXWAWWIz1V4dhCX" },
    { name: "Mountain goats", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-1pnGqlT-YQVAySfjjvasbOl4ezGQKzS5bx3QXO0J5DgUQDcY" },
    { name: "salmon creek", image: "" },
    { name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEtom84s-GfoGX2kQteC6XPoznI20buiV9vXWAWWIz1V4dhCX" },
    { name: "Mountain goats", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-1pnGqlT-YQVAySfjjvasbOl4ezGQKzS5bx3QXO0J5DgUQDcY" },
    { name: "salmon creek", image: "" },
    { name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEtom84s-GfoGX2kQteC6XPoznI20buiV9vXWAWWIz1V4dhCX" },
    { name: "Mountain goats", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-1pnGqlT-YQVAySfjjvasbOl4ezGQKzS5bx3QXO0J5DgUQDcY" }


];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
})

app.get("/campgrounds", (req, res) => {
    //get all campgrounds from db
    Campground.find({}, (err, result) => {    // result here is all campgrounds from DB
        if (err) console.log(err);
        else res.render("campgrounds", { campgrounds: result });
    })
});

app.post("/campgrounds", (req, res) => {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
    //create new campground and save in database
    Campground.create(newCampground, (err, newCamp) => {
        if (err) console.log(err);
        else res.redirect("/campgrounds");
    })

});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
})

app.listen(3000, () => {
    console.log("server is on");
})