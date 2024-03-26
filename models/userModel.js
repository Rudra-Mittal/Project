const { string } = require("joi");
const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    // username and password will be automaticallt added by passport local moongose
    email:{
        type:String,
        required:true
    },
})
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);