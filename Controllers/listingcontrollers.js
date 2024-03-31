const Listing = require("../models/listingModel.js");
const ExpressError = require("../utils/ExpressError.js");
const { URLSearchParams } = require('url');
async function runGeocode(point) {
    // console.log(point);
    try {
        const fetch = await import('node-fetch');
        const queryParams = new URLSearchParams({
            q:`${point}`,
            locale: 'en',
            limit: '1',
            reverse: 'false',
            debug: 'false',
            // point: '',
            provider: 'default',
            key: process.env.MAP_API_KEY
        }).toString();

        const response = await fetch.default(`https://graphhopper.com/api/1/geocode?${queryParams}`, {
            method: 'GET'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
module.exports.index=async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/index.ejs", { listings });
}
module.exports.getUpdate=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot edit a Listing that does not exist");
        res.redirect("/listings");
    }
    let url=listing.image.url;
    listing.image.url=url.replace("/upload","/upload/h_150,w_200")
    res.render("listings/update.ejs", { listing });
}
module.exports.putUpdate=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "No/incomplete data Entered for listings");
    }
    let { id } = req.params;
    // let listing= await Listing.findById(id);
    let url= req.file.path;
    let filename= req.file.filename;
    req.body.listing.image={url,filename};
    let point=req.body.listing.location;
    let geocodeData;
    try {
        geocodeData = await runGeocode(point);
        if(!geocodeData.hits){
            throw new ExpressError(400,"Location does'nt exist");
        }
    } catch (error) {
        console.error("Error during geocoding:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    let lat=geocodeData.hits[0].point.lat;
    let lng=geocodeData.hits[0].point.lng;
    req.body.listing.coordinates={lat,lng}
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Review Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.getCreate= (req, res) => {
    res.render("listings/new.ejs");
}
module.exports.postCreate=async (req, res, next) => {
    let url= req.file.path;
    let filename= req.file.filename;
    req.body.listing.owner = req.user;
    const listing = new Listing(req.body.listing);
    // console.log(point);
    let point=listing.location;
    let geocodeData;
    try {
        geocodeData = await runGeocode(point);
        if(!geocodeData.hits){
            throw new ExpressError(400,"Location does'nt exist");
        }
    } catch (error) {
        console.error("Error during geocoding:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    listing.image={url,filename};
    listing.coordinates.lat=geocodeData.hits[0].point.lat;
    listing.coordinates.lng=geocodeData.hits[0].point.lng;
    // res.send(listing);
    await listing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}
module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", `${list.title} listing Deleted Successfully`);
    res.redirect("/listings");
}
module.exports.show=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate:{
        path: "author"
    } }).populate("owner");
    if (!listing) {
        req.flash("error", "No listing found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}
