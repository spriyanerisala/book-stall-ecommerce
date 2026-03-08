import express from 'express';
import {addToCart,getCart,updateCart,removeFromCart,} from '../controllers/cartController.js';
import { authMiddleware} from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.post('/add-to-cart',authMiddleware,addToCart);
cartRouter.put('/update-cart-item',authMiddleware,updateCart);
cartRouter.get('/get-cart-items',authMiddleware,getCart);
cartRouter.delete('/delete-cart-item/:productId',authMiddleware,removeFromCart);



export default  cartRouter;