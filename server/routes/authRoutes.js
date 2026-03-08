import express from 'express';
import {signup,login,logout,resetPassword,forgotPassword,changePassword, oauthLogin} from '../controllers/authController.js';
import { authMiddleware} from '../middleware/authMiddleware.js';
const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',authMiddleware,logout);
authRouter.post('/forgot-password',forgotPassword);
authRouter.put('/reset-password/:token',resetPassword);
authRouter.put('/change-password',authMiddleware,changePassword);
authRouter.post('/oauth-login',oauthLogin);
export default authRouter;