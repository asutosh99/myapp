var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/",function(req,res){
    
    Campground.find({}, function(err, allCampgrounds){
                  if(err){
                      console.log(err);
                  } else {
                     res.render("campgrounds/index",{camp:allCampgrounds, currentUser: req.user });
                  }
               });
           }); 

router.post("/",middleware.isLoggedIn,function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var desc =req.body.description;
   var author={
       id:req.user._id,
       username:req.user.username
   }
   var newCamp={ name:name,image:image,description:desc,author:author}
   Campground.create(newCamp, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //redirect back to campgrounds page
           res.redirect("/camp");
       }
   });
})
;

router.get("/new",middleware.isLoggedIn,function(req,res){
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log("error");
       }else{
           res.render("campgrounds/new",{campground:campground});
       }
   });
  

});

router.get("/:id", function(req, res){
       //find the campground with provided ID
       Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
           if(err){
               console.log(err);
           } else {
               console.log(foundCampground)
               //render show template with that campground
               res.render("campgrounds/show", {campground: foundCampground});
           }
       });
   })
   router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
   //edit camp
//    router.get("/:id/edit",function(req,res){
//        if(req.isAuthenticated()){
//         Campground.findById(req.params.id,function(err, foundCampground){
//         if(err){
//             res.render("/camp");
//         }else{
//             if(foundCampground.author.id.equal(req.user.id)){
    //                 res.render("campgrounds/edit",{campground:foundCampground});
//             }else{
    //                 res.send("noy permitted");
    //             }
    //         }
    //        });
//        }else{
//            res.send(" pls log in");
//        }
       

//    });
   //update the id
   router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/camp/" + req.params.id);
       }
    });
});
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/camp");
        }else{
            res.redirect("/camp");
        }
    });
});
  

   module.exports=router;
