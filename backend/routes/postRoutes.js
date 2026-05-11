import express from "express";

import {
  createPost,
  updatePost,
  getPosts,
  getSinglePost,
} from "../controllers/postController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/post", uploadMiddleware.single("file"), createPost);

router.put("/post", uploadMiddleware.single("file"), updatePost);

router.get("/post", getPosts);

router.get("/post/:id", getSinglePost);

export default router;