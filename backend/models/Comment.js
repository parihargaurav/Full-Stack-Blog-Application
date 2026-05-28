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
      // Used for nested replies
      // If null => top-level comment
      // If ObjectId => reply to another comment
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    claps: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

/**
 * Compound Index
 *
 * Optimizes queries like:
 *
 * Comment.find({ post: postId })
 *        .sort({ createdAt: -1 })
 *
 * Meaning:
 * - First filter by post
 * - Then sort by latest comments
 */
CommentSchema.index({ post: 1, createdAt: -1 });

/**
 * Single Field Index
 *
 * Optimizes fetching replies:
 *
 * Comment.find({ parentComment: commentId })
 *
 * Useful for nested/threaded comments
 */
CommentSchema.index({ parentComment: 1 });

const CommentModel = model("Comment", CommentSchema);

export default CommentModel;