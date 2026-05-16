import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    parentComment: {
      // For nested replies
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    claps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CommentModel = model("Comment", CommentSchema);
export default CommentModel;