const Listing =require("../models/listing.js");


module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{ allListing});
};

module.exports.renderNewForm = (req,res)=>{ 
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"review",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exits");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listing });
};

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
};

module.exports.editlisting = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","Edit Successfully");
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }

    req.flash("success","Update Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully");
    res.redirect("/listings");
};