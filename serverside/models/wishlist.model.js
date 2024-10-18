import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
    buyerId:{type:String},
    sellerId:{type:String},
    products:{type:Object}


})
export default mongoose.model.Wishlist||mongoose.model("Wishlist",wishlistSchema)