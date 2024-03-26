const Listing =require("./models/listingModel.js");
const review=require("./models/reviewsModel.js");
const {listingSchema}=require("./schemaValidate.js");
const {reviewSchema}=require("./schemaValidate.js");
const ExpressError= require("./utils/ExpressError.js");
module.exports.isLoggedIn= async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL=req.originalUrl;
        req.flash("error","Login, to create Listing")
        return res.redirect("/login");
    }
    next();
}
module.exports.savedRedirectUrl=((req,res,next)=>{
    // console.log(req.session);
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
})
module.exports.isOwner= async (req,res,next)=>{
    let {id}= req.params;
    // console.dir(Listing);
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to alter");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId}= req.params;
    let rev= await review.findById(reviewId).populate("author");
    if(!rev.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission as author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        // console.log("error detected");
        let msg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,msg);
    }
    next();
}
module.exports.validateReviews=(req,res,next)=>{
    // console.log(req.body);
    let {error}= reviewSchema.validate(req.body);
    if(error){
        // console.log("error detected");
        let msg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,msg);
    }
    next();
}