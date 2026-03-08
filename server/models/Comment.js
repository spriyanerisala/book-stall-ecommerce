import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: String,
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment =  mongoose.model("Comment", commentSchema);
export default Comment;