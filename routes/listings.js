const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingControllers=require("../Controllers/listingcontrollers.js");
const multer=require("multer");
const {storage}=require("../CloudConfig.js");
const upload=multer({storage:storage});


router.get("/", wrapAsync(listingControllers.index));

router.route("/new")
.get(isLoggedIn, wrapAsync(listingControllers.getCreate))
.post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.postCreate));

router.route("/:id/update")
.get(isLoggedIn, isOwner, wrapAsync(listingControllers.getUpdate))
.put( isLoggedIn, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.putUpdate));
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingControllers.delete));
router.get("/:id", wrapAsync(listingControllers.show));

router.get("/geocode/:point", async (req, res) => {
   
});
module.exports = router;