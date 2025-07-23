if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose")
const Listing =require("./models/listing.js");
const path = require("path");
const methodOverride =require ("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema , reviewSchema}= require("./schema.js");
const Review =require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public"))); 

const dbUrl =process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("err",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
      resave:false,
      saveUninitialized:true,
      cookie:{
        expires:Date.now() + 7 * 24 *60 * 60 *1000,
        maxAge:7 * 24 *60 * 60 *1000,
        httpOnly:true,
      },
};

app.get("/",(req,res)=>{
    res.redirect(`/listings/${id}`);
});



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"studend@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser= await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing ({
//         title:"My new villa",
//         description:"this place is very amazing and beautiful",
//         // image:"",
//         price:1200,
//         location:"Malvan",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was save");
//     res.send("Successful");
// });

// app.all("*",async(req,res,next)=>{
//     try{
//         await next(new ExpressError(404,"Page not Found"));
//     }catch(err){
//         res.send(err);
//     }
   
// });


app.use((err,req,res,next)=>{
    let {statusCode ,message} = err;
    res.render("error.ejs",{ message })
    // res.status(statusCode).send(message);
});


app.listen(3000,()=>{
    console.log("server listening to port 3000");
});