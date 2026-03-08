import express from 'express';

import {getAllProducts,getOneProduct, addOrUpdateRating, deleteRating} from '../controllers/adminContoller.js';
import {authMiddleware} from '../middleware/authMiddleware.js';


const productRouter = express.Router();

productRouter.get('/all-products',getAllProducts);
productRouter.get('/get-one-product/:id',getOneProduct);

productRouter.post('/rate/:productId',authMiddleware,addOrUpdateRating);
productRouter.delete('/rate/:productId',authMiddleware,deleteRating);


export default productRouter