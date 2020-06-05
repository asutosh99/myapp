var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/camp");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                comment.author.id=req.user_id;
                comment.author.username=req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success","comment posted");
                res.redirect('/camp/' + campground._id);
            }
         });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 });  
 router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
        res.render("comments/edit",{campground_id: req.params.id,comment: foundComment});
        }
 });
}); 
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.flash("success","comment edited");
           res.redirect("/camp/" + req.params.id );
       }
    });
 });
// router.put("/:comment_id",function(req,res){
//     res.send("u r in put");
// });
// COMMENT DESTROY ROUTE

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/camp/" + req.params.id);
       }
    });
});


 module.exports=router;
