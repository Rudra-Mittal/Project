const moongose=require("mongoose");
const listingSchema=moongose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        default:"https://i.pinimg.com/originals/d0/ed/a9/d0eda9e982736722ec55c41f37134a48.jpg",
        type:String,
        set: (v)=> v==""?"https://i.pinimg.com/originals/d0/ed/a9/d0eda9e982736722ec55c41f37134a48.jpg":v
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:String
});
const Listing=moongose.model("Listing",listingSchema);
module.exports=Listing;