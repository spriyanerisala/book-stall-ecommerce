import express from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import {authMiddleware} from '../middleware/authMiddleware.js';

const commentRouter = express.Router();

commentRouter.get("/:productId", getComments);
commentRouter.post("/:productId", authMiddleware, addComment);
commentRouter.put("/:commentId", authMiddleware, updateComment);
commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
