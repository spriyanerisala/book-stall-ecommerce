import express from 'express';
import { getUserOrders, placeOrder } from '../controllers/myOrders.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.get('/my-orders',authMiddleware,getUserOrders);
orderRouter.post('/place-order',authMiddleware,placeOrder);
export default orderRouter;