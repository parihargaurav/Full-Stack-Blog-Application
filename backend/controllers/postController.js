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