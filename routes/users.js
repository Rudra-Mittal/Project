const express= require("express");
const router= express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl} = require("../middleware.js");
const userControllers=require("../Controllers/usercontrollers.js");
router.route("/signup")
.get(wrapAsync(userControllers.getSignUp))
.post(wrapAsync(userControllers.postSignUp));

router.route("/login")
.get(wrapAsync(userControllers.getLogin))
.post(savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), wrapAsync(userControllers.postLogin));

router.get("/logout",wrapAsync(userControllers.logout));

module.exports=router;