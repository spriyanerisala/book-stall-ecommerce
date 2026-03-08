import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:"Order",required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    amount:{type:Number,required:true},
    method:{
        type:String,
        enum:["COD","CARD","UPI"],
        default:"CARD"
    },
    status:{
        type:String,
        enum:["PENDING","COMPLETED","FAILED"],
        default:"pending"
    },
    transitionId:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
   
})

const Payment = mongoose.model("Payment",paymentSchema);
export default Payment;