const Listing = require("../models/listingModel.js");
const ExpressError = require("../utils/ExpressError.js");
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
    let url= req.file.path;
    let filename= req.file.filename;
    req.body.listing.image={url,filename};
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
    listing.image={url,filename};
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