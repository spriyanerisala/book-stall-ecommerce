import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    category:{type:String,required:true},
    subCategory:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String},
    ratings:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            rating:{
                type:Number,
                
                min:1,
                max:5
            }
        }
    ],
    stock:{type:Number,required:true,default:0}
})

const Product = mongoose.model("Product",productSchema);
export default Product;