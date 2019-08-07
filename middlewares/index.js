var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//middleware checks ownership of campgorunds before editing
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    //check if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) res.redirect("/campgrounds");
            else {
                //check if the campground belogs to user currently logged in
                if ((foundCampground.author.id).equals(req.user._id)) {
                    return next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//check ownership of comments 
middlewareObj.checkCommentOwnership = (req, res, next) => {
    //check if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) res.redirect("back");
            else {
                //check if the campground belogs to user currently logged in
                if ((foundComment.author.id).equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;