var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [{
    name: "shenandoe Nation",
    image: "https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
    description: "blah blah blah blah"
},
{
    name: "Windsor",
    image: "https://www.straitstimes.com/sites/default/files/articles/2017/04/22/42323577_-_22_04_2017_-_anwindsor23.jpg",
    description: "blah blah blah blah"
},
{
    name: "GirdLed",
    image: "http://www.lakemetroparks.com/KenticoTemplate/media/LakeMetroparks/Shelters/Girdled-Road-Reservation-Campsite-634x512-photo-by-Kevin-Vail.jpg",
    description: "blah blah blah blah"
},
{
    name: "Maryland",
    image: "https://cdn.onlyinyourstate.com/wp-content/uploads/2018/03/3540441773_f037fc7263_o.jpg",
    description: "blah blah blah blah"
}]

function seedDB() {
    //remove all campgrounds
    Campground.deleteMany({}, error => {
        if (error) console.log(error);
        console.log("removed campgrounds");

        //ADD a few campgrounds to work with
        // data.forEach((seed) => {
        //     Campground.create(seed, (err, data) => {
        //         if (err) console.log(err);
        //         else console.log("added a campground");
        //         //Create a Comment 
        //         Comment.create({
        //             text: "there should have been a wifi connection",
        //             author: "kanav sharma"
        //         }, (err, comment) => {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 //push it into comments array

        //                 data.comments.push(comment);
        //                 //save the campground 
        //                 data.save();
        //                 console.log("created new comment");
        //             }
        //         })


        //     });
        // });
    });


}
module.exports = seedDB;

