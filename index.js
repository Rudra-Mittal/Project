const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listingModel.js");
const path=require("path");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
const app=express();
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/styles")));
app.use(express.static(path.join(__dirname,"/public/scripts")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
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
app.get("/listings",async(req,res)=>{
    let listings=await Listing.find();
    res.render("listings/index.ejs",{listings});
})


app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings/new",async(req,res)=>{
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
    console.log(req.body);
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
})
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
     res.render("listings/show.ejs",{listing});
})

app.listen(port,(req,res)=>{
    console.log(`app is listening on port${port}`);
})