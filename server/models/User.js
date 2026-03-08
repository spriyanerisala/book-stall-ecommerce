import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const cartItemsSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    title:{type:String,required:true},
    price:Number,
    image:String,
    quantity:
    {
        type:Number,
        default:1
    }
})


const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    role:{type:String,enum:["user","admin"],default:"user"},
    cartItems:[cartItemsSchema],
    cartTotal : {
        type:Number,
        default:0
    }
})




userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User",userSchema);
export default User;