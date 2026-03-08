import express from 'express';
import { createCheckoutSession,stripeWebhook } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const paymentRouter = express.Router();

paymentRouter.post('/create-checkout-session',authMiddleware,createCheckoutSession);


export default paymentRouter;