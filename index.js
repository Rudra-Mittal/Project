require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
const app=express();
const session= require("express-session");
const flash =require("connect-flash");
app.use(express.static(path.join(__dirname,"/public/styles")));
app.use(express.static(path.join(__dirname,"/public/scripts")));
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema}=require("./schemaValidate.js");
// const {reviewSchema}=require("./schemaValidate.js");
// const review= require("./models/reviewsModel.js");
engine=require("ejs-mate");
app.engine("ejs",engine);
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
const methodOverride=require("method-override")
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const listingRouter= require("./routes/listings.js");
const reviewRouter= require("./routes/reviews.js");
const userRouter=require("./routes/users.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/userModel.js");
const port=8080;
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        httpOnly:true
    }
}; 

main()
.then(()=>{
    console.log("Connection successfull");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoURL);
}
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.send("you are on home page");
})
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found :("));
})


app.listen(port,(req,res)=>{
    console.log(`app is listening on port${port}`);
})
app.use((err,req,res,next)=>{
    let{status=500,message="Something went Wrong"}=err;
    res.render("listings/error.ejs",{status,message});
    // res.status(status).send(message);
})
