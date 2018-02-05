var express = require("express");
var router = express.Router();
var Travelnote = require("../models/travelnote");
var middleware = require("../middleware");
var geocoder = require("geocoder");
//middleware



// INDEX  display a list of all travelnotes
router.get("/", function(req, res){
    // Get all travelnotes from DB
    Travelnote.find({}, function(err, allTravelnotes){
        if(err){
            console.log(err);
        } else {
            res.render("travelnotes/index",{travelnotes:allTravelnotes, currentUser: req.user});
        }
    });
});

//CREATE - add new travelnote to DB
router.post("/", middleware.isLoggedIn, function(req, res){
// get data from form and add to travelnotes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if(err) {
            console.log(err);
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newTravelnote = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
        // Create a new travelnote and save to DB
        Travelnote.create(newTravelnote, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
        //redirect back to travelnotes page
            console.log(newlyCreated);
            res.redirect("/travelnotes");
            }
        });
    });
});


// NEW display a form to make a new travelnote
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("travelnotes/new");    
});

//SHOW - shows more info about one travelnote
router.get("/:id", function(req, res) {
    //find the travelnote with the provided id
    Travelnote.findById(req.params.id).populate("comments").exec(function(err, foundTravelnote){
        if(err){
            console.log(err);
        } else {
            console.log(foundTravelnote);
            res.render("travelnotes/show", {travelnote:foundTravelnote, currentUser: req.user});
        }
    });
});

// Edit Travelnote Route
router.get("/:id/edit", middleware.checkTravelnoteOwnership, function(req, res) {
    //var User = req.user;
    Travelnote.findById(req.params.id, function(err, foundTravelnote){
        if(err){
            res.redirect("/travelnotes");
        } else{
            res.render("travelnotes/edit", {travelnote:foundTravelnote, currentUser: req.user});
        }
    });
});
// Update Travelnote Route


router.put("/:id", function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address, try typing a new address');
            return res.redirect('back');
        }   
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Travelnote.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, travelnote){
            if(err){
               req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/travelnotes/" + travelnote._id);
            }
        });
    });
});

// Destory Travelnote Route
router.delete("/:id", middleware.checkTravelnoteOwnership, function(req, res){
    Travelnote.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/travelnotes");
        } else{
            res.redirect("/travelnotes");
        }
    });
});


module.exports = router;