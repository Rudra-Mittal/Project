const express=require("express");
const mongoose=require("mongoose");
const Listing= require("../models/listingModel.js");
// const app=express();

const {listingSchema}=require("../schemaValidate.js");
const {reviewSchema}=require("../schemaValidate.js");
const review= require("../models/reviewsModel.js");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
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
router.get("/",wrapAsync(async(req,res)=>{
    let listings=await Listing.find();
    res.render("listings/index.ejs",{listings});
}));

router.get("/:id/update",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot edit a Listing that does not exist");
        res.redirect("/listings");
    }
    res.render("listings/update.ejs",{listing});
}))
router.put("/:id/update",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"No/incomplete data Entered for listings");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Review Updated");
    res.redirect(`/listings/${id}`);
}));
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
// delete listing
router.delete("/:id/delete",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    console.log(list);
    await Listing.findByIdAndDelete(id);
    req.flash("success",`${list.title} listing Deleted Successfully`);
    res.redirect("/listings");
}));
router.post("/new",wrapAsync(async(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
        const listing = new Listing(req.body.listing);
        await listing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
}));
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","No listing found");
        res.redirect("/listings");
    }
    // console.log(listing.reviews);
     res.render("listings/show.ejs",{listing});
}));
// router.all("*",wrapAsync (async(req,res)=>{
//     req.flash("error","Could'nt find Listing");
//     res.redirect("/listings");
// }));

module.exports= router;