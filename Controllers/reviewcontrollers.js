const Listing= require("../models/listingModel.js");
const review= require("../models/reviewsModel.js");
module.exports.postCreate=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    req.body.review.author=req.user;
    let newReview= new review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}
module.exports.destroy=async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    res.redirect(`/listings/${id}`);
}