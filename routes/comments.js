var express = require("express");
var router = express.Router({mergeParams: true});
var Travelnote = require("../models/travelnote");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//middleware




// ===============
// COMMENTS ROUTES
// ===============
//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
   //res.send("This will be the comment form");
   // find travelnote by id
   Travelnote.findById(req.params.id, function(err, travelnote){
      if(err){
          console.log(err);
      } else{
          res.render("comments/new", {travelnote: travelnote});
      }
   });
});

//comment create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup travelnote using ID
    Travelnote.findById(req.params.id, function(err, travelnote) {
       if(err){
           console.log(err);
           res.redirect("/travelnotes");
       } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    travelnote.comments.push(comment);
                    travelnote.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect('/travelnotes/' + travelnote._id);
                }
            }); 
            //create new comment
            //connect new comment to campgrountravelnote
            //redirect travelnote show page
       }
    });
});

// Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Travelnote.findById(req.params.id, function(err, foundTravelnote) {
        if(err || !foundTravelnote){
            req.flash("error", "Travelnote not found!");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {travelnote_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

// Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/travelnotes/" + req.params.id);
       }
    });
});

// Destory Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Successfully delete comments!");
            res.redirect("/travelnotes/" + req.params.id);
        }
    }) ;
});


module.exports = router;