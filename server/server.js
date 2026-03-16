import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import { stripeWebhook } from './controllers/paymentController.js';
import orderRouter from './routes/orderRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import { redis } from './config/redis.js';
import { connectDB } from './config/db.js';
import { preloadProductsToRedis,preloadUsersToRedis ,preloadCommentsToRedis,preloadOrdersToRedis } from './preloadData/preloadData.js';
import cartRouter from './routes/cartRoutes.js';
import paymentRouter from './routes/paymentRoute.js';
import adminRouter from './routes/adminRoutes.js';
const app = express();



app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:[process.env.CLIENT_URL,process.env.ADMIN_URL],

  credentials:true
}));

await connectDB();


(async () => {
  try {
    await redis.set("health", "OK");
    console.log("Redis connected successfully");
  } catch (err) {
    console.error("Redis connection failed", err);
  }
})();


app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders',orderRouter);
app.use('/api/comments',commentRouter);
app.use('/api/cart',cartRouter);
app.use('/api/payment',paymentRouter);
app.use('/api/admin',adminRouter);

app.get('/', (req, res) => {
  res.send("Book Stall Ecommerce API is working");
});



preloadUsersToRedis();
preloadProductsToRedis();
preloadCommentsToRedis();
preloadOrdersToRedis();


const port = process.env.PORT || 5000;
app.listen(port,"0.0.0.0" ,() => {
  console.log(`Server is running on : http://0.0.0.0:${port}`);
});
