const moongose=require("mongoose");
const Schema= moongose.Schema;
const reviewSchema= moongose.Schema({
    comment:{
        type: String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=moongose.model("review",reviewSchema);