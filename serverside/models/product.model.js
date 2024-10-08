import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    pname:{type:String},
    price:{type:String},
    category:{type:String},
    description:{type:String},
    images:{type:Array},
    sellerId:{type:String},
    address:{type:String},
    place:{type:String},
    phone:{type:Number},
    pincode:{type:Number}


})
export default mongoose.model.Product||mongoose.model("Product",productSchema)