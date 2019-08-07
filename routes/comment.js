var express = require('express');
var router = express.Router({ mergeParams: true });
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var middleware = require("../middlewares");

//NEW COMMENT FORM ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) console.log(err);
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});

//ADD/SAVE COMMENT ROUTE
router.post("/", (req, res) => {
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
                    //add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
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

//GET EDIT FORM ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => { //find comment by id 
        if (err) {
            res.redirect("back");
        }
        else {
            //Render the template and pass the comment to the template
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    })
});

//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //find the comment by ID and update it 
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        }
        else {
            //Redirect to the campground after everything went well 
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //find comment by ID and delete it 
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) res.redirect("back");
        //if no error redirect to the campground 
        else res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;