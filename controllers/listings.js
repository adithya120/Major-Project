const Listing=require("../models/listing.js")
// const fetch=require("node-fetch");
const axios = require("axios");


module.exports.index =async(req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index",{allListings}) 
} 

module.exports.newListing=(req,res)=>{
    res.render("listings/new");
}

module.exports.showListing=async(req,res)=>{
 const {id}=req.params;
 const listing=await Listing.findById(id)
 .populate({path:"reviews",
  populate:{
    path:"author",
  },
 })
 .populate("owner");
 if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
 }
   console.log(listing);
   res.render('listings/show.ejs',{listing, currUser: req.user,
    mapTilerKey: process.env.MAP_TILER,});
}

module.exports.createListing = async (req, res, next) => {
  try {
    // 1️⃣ Get location and MapTiler key
    const location = req.body.listing.location;
    const MAPTILER_KEY = process.env.MAP_TILER;

    // 2️⃣ Create new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // 3️⃣ Add image info
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // 4️⃣ Forward geocode using MapTiler
    const geoRes = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${MAPTILER_KEY}&limit=1`
    );
    const geoData = geoRes.data;

    if (geoData.features && geoData.features.length > 0) {
      const [lng, lat] = geoData.features[0].geometry.coordinates;
      newListing.geometry = { type: "Point", coordinates: [lng, lat] };
    } else {
      // fallback if geocoding fails
      newListing.geometry = { type: "Point", coordinates: [0, 0] };
    }

    // 5️⃣ Save listing
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

module.exports.editListing=async (req,res)=>{
     const {id}=req.params;
     const listing=await Listing.findById(id);
      if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
    }

    let orignalImageUrl = listing.image.url;
    orignalImageUrl.replace("/upload","/upload,/w_250");
    res.render("listings/edit.ejs",{listing ,orignalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    const {id}=req.params;
      let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true, runValidators: true, context: "query" });

    if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image={url,filename};
     await listing.save();
    }

      req.flash("success","Listing Updated");
      res.redirect(`/listings/${id}`);
    }

module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect('/listings');
}