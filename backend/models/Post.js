import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: String,

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    claps: {
      type: Number,
      default: 0,
    },
    clappedBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1, max: 50 }, // per-user clap count
      },
    ],

    // 🔁 REPOSTS
    reposts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    repostCount: { type: Number, default: 0 },
    isRepost: { type: Boolean, default: false },
    originalPost: { type: Schema.Types.ObjectId, ref: "Post" }, // if it's a repost
    repostedBy: { type: Schema.Types.ObjectId, ref: "User" }, // who reposted
  },
  {
    timestamps: true,
  },
);

const PostModel = model("Post", PostSchema);

export default PostModel;
