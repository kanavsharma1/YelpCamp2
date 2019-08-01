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

//requiring routes
var commentRoute = require('./routes/comment'),
    campGroundRoute = require('./routes/campgrounds'),
    authRoute = require('./routes/authentication');

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



app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("campgrounds/landing");
});

//==========================CAMPGROUND ROUTES ====================================
app.use("/campgrounds", campGroundRoute);

//==========================COMMENTS ROUTES ====================================
app.use("/campgrounds/:id/comment", commentRoute);

//=======================AUTH ROUTES ==============================//
app.use(authRoute);


app.listen(3000, () => {
    console.log("server is on");
});