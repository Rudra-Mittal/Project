const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listingModel.js");
const mongoURL="mongodb://127.0.0.1:27017/airbnb"
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
async function initdb(){
    console.log(initdata);
    // await Listing.insertMany(initdata.data);
}
initdb();