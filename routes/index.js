var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Travelnote = require("../models/travelnote");
var async = require("async");
var nodemailer = require("nodemailer");


router.get("/", function(req, res){
    res.render("landing");
});


//================
//Auth Routes
//================

// root route
router.get("/register", function(req, res) {
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, 
                            firstName: req.body.firstName, 
                            lastName: req.body.lastName, 
                            email: req.body.email, 
                            avatar: req.body.avatar});
    if(req.body.adminCode === '102514wwd') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/travelnotes");
       });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/travelnotes",
        failureRedirect: "login"
    }), function(req, res) {
});

// logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/travelnotes");
});

//forget password

//User Profile
router.get("/users/:id", function(req, res) {
   User.findById(req.params.id, function(err, foundUser) {
      if(err) {
          req.flash("error", "Something went wrong");
          res.redirect("/");
      }
    Travelnote.find().where('author.id').equals(foundUser._id).exec(function(err, travelnotes) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        res.render("users/show", {user: foundUser, travelnotes: travelnotes});
    });
   });
});

module.exports = router;