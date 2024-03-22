const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listingModel.js");
const path=require("path");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
const app=express();
const session= require("express-session");
const wrapAsync=require("./utils/wrapAsync.js");
app.use(express.static(path.join(__dirname,"/public/styles")));
app.use(express.static(path.join(__dirname,"/public/scripts")));
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schemaValidate.js");
// const {reviewSchema}=require("./schemaValidate.js");
// const review= require("./models/reviewsModel.js");
const flash =require("connect-flash");
engine=require("ejs-mate");
app.engine("ejs",engine);
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
const methodOverride=require("method-override")
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const listing= require("./routes/listings.js");
const reviews= require("./routes/reviews.js");
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
app.get("/",(req,res)=>{
    res.send("you are on home page");
})
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews);
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
