const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listingModel.js");
const path=require("path");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
const app=express();
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
engine=require("ejs-mate");
app.engine("ejs",engine);
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/styles")));
app.use(express.static(path.join(__dirname,"/public/scripts")));
app.set("view engine","ejs");
const methodOverride=require("method-override")
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const port=8080;
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
app.get("/",(req,res)=>{
    res.send("you are on home page");
})
app.get("/listings",wrapAsync(async(req,res)=>{
    let listings=await Listing.find();
    res.render("listings/index.ejs",{listings});
}));

app.get("/listings/:id/update",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/update.ejs",{listing});
}))
app.put("/listings/:id/update",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"No/incomplete data Entered for listings");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.delete("/listings/:id/delete",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
app.post("/listings/new",wrapAsync(async(req,res,next)=>{
    // let {title,price,description,location,country,image}=req.body;
    // console.log("new creating request received",req.body);
    // let listing= new Listing({
    //     title:`${title}`,
    //     price:`${price}`,
    //     description:`${description}`,
    //     location:`${location}`,
    //     country:`${country}`,
    //     image:`${image}`
    // })
    // OR
    if(!req.body.listing){
        throw new ExpressError(400,"No/incomplete data Entered for listings");
    }
        const listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect("/listings");
}));
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
     res.render("listings/show.ejs",{listing});
}));
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
