const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router=express.Router({mergeParams:true});
const {validateReviews,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewControllers=require("../Controllers/reviewcontrollers.js");

router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewControllers.postCreate));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroy));

module.exports=router;