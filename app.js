var express = require('express'),
    passport = require('passport'),
    localStratergy = require('passport-local'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    app = express();


seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelpcamp_v4", { useNewUrlParser: true });

//PASSPORT CONFIGURATIONS====================================///
app.use(require('express-session')({
    secret: "kanav's restfull app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==================================================================

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
})

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

app.get("/campgrounds/new", isLoggedIn, (req, res) => {
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
app.get("/campgrounds/:id/comment/new", isLoggedIn, (req, res) => {
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
                    //redirect campground to show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })

        }
    });
});

//=======================AUTH ROUTES ==============================//
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
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
//=========================LOGIN routes=================///
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {

    });
//logout route
app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");

}
app.listen(3000, () => {
    console.log("server is on");
});