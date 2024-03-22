const express=require("express");
const mongoose=require("mongoose");
const Listing= require("../models/listingModel.js");
const {listingSchema}=require("../schemaValidate.js");
const {reviewSchema}=require("../schemaValidate.js");
const wrapAsync=require("../utils/wrapAsync.js");
const router=express.Router({mergeParams:true});
const review= require("../models/reviewsModel.js");
const validateListing=(req,res,next)=>{
    // console.log(req.body);
    let {error}= reviewSchema.validate(req.body);
    if(error){
        // console.log("error detected");
        let msg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,msg);
    }
    next();
}
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    // console.log(listing);
    let newReview= new review(req.body.review);
    listing.reviews.push(newReview);
    // console.log(listing);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}));
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    res.redirect(`/listings/${id}`);
}));
module.exports=router;