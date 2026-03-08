import User from '../models/User.js';
import Product from '../models/Product.js';
import {redis} from '../config/redis.js';

export const addToCart = async(req,res)=>{
    try{

        const userId = req.userId;
        
        const { productId ,quantity} = req.body;

        
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "ProductId and quantity required"
      });
    }

        const product = await Product.findById(productId);
        if(!product) return res.status(400).json({success:false,message:"Product not Found"});

        const cartKey = `cart:${userId}`;

        let cart = await redis.get(cartKey);
        cart = cart || [];

        const existingItem = cart.find(item => item.productId === productId);

        if(existingItem){
            existingItem.quantity += quantity;
        }else{
            cart.push({
                productId : productId,
                title:product.title,
                price:product.price,
                image:product.image,
                quantity:quantity,
            })
        }


        await redis.set(cartKey,cart);
        return res.status(200).json({success:true,message:"Added To Cart",cartItems : cart})

    }catch(err){
        return res.json({success:false,message:"Error in add To Cart Controller",err});
    }
}


export const getCart  =async(req,res)=>{
  try{
      const userId = req.userId;
    const cart = await redis.get(`cart:${userId}`) || [];
    return res.status(200).json({success:true,message:`Cart Items of the  ${userId}`,cartItems : cart})
  }catch(err){
    return res.status(500).json({success:false,message:"Error in getCart Controller",error:err.message})
  }
}


export const updateCart = async (req,res)=>{
    try{
        const userId = req.userId;
    
    const {productId ,quantity} = req.body;

    const cartKey = `cart:${userId}`;
    let cart = await redis.get(cartKey) || [];

    cart = cart.map(item => item.productId === productId ? {...item,quantity} : item ) ;
    await redis.set(cartKey,cart);

    return res.status(200).json({success:true,message:"Cart Updated",cartItem : cart});
    }catch(err){
        return res.status(500).json({success:false,message:"Error in Cart Updated",error:err.message});
    }
}

export const removeFromCart = async(req,res)=>{
    try{
          const userId = req.userId;
          const {productId} = req.params;
          
          const cartKey =`cart:${userId}`;
          let cart = await redis.get(cartKey) || [];

          cart = cart.filter(item => item.productId !== productId);

          await redis.set(cartKey,cart);
          return res.status(200).json({success:true,message:"Product Removed From the Cart Successfully",RemovedItem : cart});
    }catch(err){
        return res.status(500).json({success:false,message:"Error in removeFromCart Controller",error:err.message});
    }
}


