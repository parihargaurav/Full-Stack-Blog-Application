import fs from "fs";
import jwt from "jsonwebtoken";

import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  const { originalname, path } = req.file;

  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];

  const newPath = path + "." + ext;

  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) {
      return res.status(401).json(err);
    }

    const { title, summary, content } = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
};


export const updatePost = async (req, res) => {
  try {
    let newPath = null;

    if (req.file) {
      const { originalname, path } = req.file;

      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];

      newPath = `${path}.${ext}`;

      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json("No token provided");
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json(err);
      }

      const { id, title, summary, content } = req.body;

      if (!id) {
        return res.status(400).json("Post id is required");
      }

      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json("Post not found");
      }

      const isAuthor = postDoc.author.equals(info.id);

      if (!isAuthor) {
        return res.status(403).json("You are not the author");
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;

      if (newPath) {
        postDoc.cover = newPath;
      }

      await postDoc.save();

      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(posts);
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;

  const postDoc = await Post.findById(id).populate("author", ["username"]);

  res.json(postDoc);
};

export const clapPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const { count = 1 } = req.body; // how many claps this click adds (1–10)

    const existing = post.clappedBy.find(
      (c) => c.user.toString() === userId
    );

    if (existing) {
      const newCount = Math.min(existing.count + count, 50); // cap at 50
      const added = newCount - existing.count;
      existing.count = newCount;
      post.claps += added;
    } else {
      post.clappedBy.push({ user: userId, count: Math.min(count, 50) });
      post.claps += Math.min(count, 50);
    }

    await post.save();

    // Return user's personal clap count + total
    const userClaps =
      post.clappedBy.find((c) => c.user.toString() === userId)?.count || 0;
    res.json({ totalClaps: post.claps, userClaps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const repostPost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // Check if user already reposted
    const alreadyReposted = originalPost.reposts.some(
      (id) => id.toString() === userId
    );

    if (alreadyReposted) {
      // Undo repost
      originalPost.reposts = originalPost.reposts.filter(
        (id) => id.toString() !== userId
      );
      originalPost.repostCount = Math.max(0, originalPost.repostCount - 1);
      await originalPost.save();

      // Remove the repost document
      await Post.deleteOne({
        originalPost: req.params.id,
        repostedBy: userId,
      });

      return res.json({ reposted: false, repostCount: originalPost.repostCount });
    }

    // Add repost
    originalPost.reposts.push(userId);
    originalPost.repostCount += 1;
    await originalPost.save();

    // Create a new Post that is a repost
    const repost = new Post({
      title: originalPost.title,
      content: originalPost.content,
      author: originalPost.author,
      cover: originalPost.cover, // or `image` if you named it that
      claps: 0,
      reposts: [],
      repostCount: 0,
      isRepost: true,
      originalPost: originalPost._id,
      repostedBy: userId,
    });

    await repost.save();

    res.json({ reposted: true, repostCount: originalPost.repostCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};