var middlewareObj = {};
var Travelnote = require("../models/travelnote");
var Comment = require("../models/comment");

middlewareObj.checkTravelnoteOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Travelnote.findById(req.params.id, function(err, foundTravelnote) {
            if(err || !foundTravelnote){
                req.flash("error", "Travelnote not found");
                res.redirect("back");
            } else{
                if(foundTravelnote.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You DO NOT have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment not found!");
                res.redirect("/travelnotes");
            } else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You DO NOT have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;