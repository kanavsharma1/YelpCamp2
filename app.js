var express = require('express'),
    passport = require('passport'),
    localStratergy = require('passport-local'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds'),
    flash = require("connect-flash"),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    app = express();

//requiring routes
var commentRoute = require('./routes/comment'),
    campGroundRoute = require('./routes/campgrounds'),
    authRoute = require('./routes/authentication');

//seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.connect("mongodb+srv://kanavsharma73:kanavsharma73@yelpcamp-b5dbo.mongodb.net/yelpcamp", { useNewUrlParser: true, useFindAndModify: false });

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

//middleware
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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