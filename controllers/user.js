const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser =new User({email,username});

    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser , (error)=>{
        if(error){
            return next();
        }
        req.flash("success","Welcome to Wandrlust");;
        res.redirect("/listings");
    });
    }catch(error){
        req.flash("err",error.message);
        res.render("/signup");
    }
};

module.exports.renderLoginForm  = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome Back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((error)=>{
        if(error){
            next(error);
        }
        req.flash("success","Your are Logged out Successfully");
        res.redirect("/listings");
    });
};

