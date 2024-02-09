const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listingModel.js");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
const app=express();
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
app.get("/testListing",async(req,res)=>{
    let newListing= new Listing({
        title:"Villa 1",
        description:"Located riverside, Amazing view",
        price:"2500000",
        location:"Dharavi,Mumbai",
        country:"India"
    })
    await newListing.save();
    res.send("saved");
})







app.listen(port,(req,res)=>{
    console.log(`app is listening on port${port}`);
})
