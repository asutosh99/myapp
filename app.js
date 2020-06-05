var express      =  require("express");
    var app          =  express();
    var bodyParser   =  require("body-parser");
    var Campground   =  require("./models/campground");
    var Comment      =  require("./models/comment");
     var  flash       = require("connect-flash");
    // var seedDB       =  require("./seeds");
    var  passport      =  require("passport");
    var LocalStrategy  = require("passport-local");
    var  User          =   require("./models/user");
    var methodOverride = require("method-override");
    
    var commentRoutes    = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes      = require("./routes/index")
    
const port=process.env.PORT || 3000;
 const mongoose = require("mongoose");
 //mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
// mongo "mongodb+srv://cluster0-a33bp.mongodb.net/<asu>" --username asu

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://test:test@cluster0-a33bp.mongodb.net/test?retryWrites=true&w=majority" ||"mongodb://localhost/yelp_camp";
// const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

 app.use(bodyParser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 //seedDB();
app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));
app.use(flash());
// passport authentification

app.use(require("express-session")({
    secret:"rusty is dog",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

 app.use("/", indexRoutes);
 app.use("/camp", campgroundRoutes);
 app.use("/camp/:id/comments", commentRoutes);

 
app.listen(port,function(){
    console.log("server started");
});


