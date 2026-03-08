import express from 'express';
import { getAllUsers,getAllTokens,clearAllTokensHash,deleteSingleToken,deleteSingleUser,clearAllUsersHash,
    getActiveCartsWithUserInfo,
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    showCache,
    clearProductsRedis,
    getOneProduct,
    getAllRatings,
    getAllOrders



 } from '../controllers/adminContoller.js';
import { authMiddleware,adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';
const adminRouter = express.Router();


adminRouter.get('/get-all-users',authMiddleware,adminOnly,getAllUsers)
adminRouter.get('/get-all-tokens',authMiddleware,adminOnly,getAllTokens);
adminRouter.delete('/delete-tokens-cache',authMiddleware,adminOnly,clearAllTokensHash);
adminRouter.delete('/delete-single-token/:email',authMiddleware,adminOnly,deleteSingleToken);
adminRouter.delete('/delete-users-cache',authMiddleware,adminOnly,clearAllUsersHash);
adminRouter.delete('/delete-single-user/:email',authMiddleware,adminOnly,deleteSingleUser);



adminRouter.post('/create-product',authMiddleware,adminOnly,upload.single("image"),createProduct);
adminRouter.get('/all-products',authMiddleware,adminOnly,getAllProducts);

adminRouter.put('/update-product/:id',authMiddleware,adminOnly,upload.single("image"),updateProduct);
adminRouter.delete('/delete-product/:id',authMiddleware,adminOnly,deleteProduct);

adminRouter.get('/show-cache',authMiddleware,adminOnly,showCache);
adminRouter.delete('/delete-products-cache',authMiddleware,adminOnly,clearProductsRedis);
adminRouter.get('/get-one-product/:id',authMiddleware,adminOnly,getOneProduct);

adminRouter.get('/all-ratings',authMiddleware,adminOnly,getAllRatings);


adminRouter.get('/active-carts',authMiddleware,adminOnly,getActiveCartsWithUserInfo);



adminRouter.get('/all-orders',authMiddleware,adminOnly,getAllOrders);
export default adminRouter;

