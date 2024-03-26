const moongose=require("mongoose");
const Schema= moongose.Schema;
const review= require("./reviewsModel.js");
const listingSchema=moongose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review",
            required:false
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await review.deleteMany({_id: {$in : listing.reviews}});
    }
})
const Listing=moongose.model("Listing",listingSchema);
module.exports=Listing;