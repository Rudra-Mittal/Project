const User=require("../models/userModel.js");
module.exports.getSignUp=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.postSignUp=async(req,res)=>{
    try{
        let {username,email,password}= req.body;
            const newUser=new User({email,username});
            const saved=await User.register(newUser,password);
            req.login(saved,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome To PropList");
                res.redirect("/listings");
            })
    } catch(err){
        console.log(err.message);
        req.flash("error",`${err.message}`);
        res.redirect("/signup");
    }
}
module.exports.getLogin=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.postLogin=async(req,res)=>{
    req.flash("success","Successfully Logged In");
    if(!res.locals.redirectURL) res.redirect("/listings");
    res.redirect(res.locals.redirectURL);
}
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
    })
    req.flash("success","Logged Out Successfully");
    res.redirect("/listings");
}