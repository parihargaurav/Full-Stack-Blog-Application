import express from "express";

import {
  createPost,
  updatePost,
  getPosts,
  getSinglePost,
  clapPost,
  repostPost,
} from "../controllers/postController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/post", uploadMiddleware.single("file"), createPost);

router.put("/post", uploadMiddleware.single("file"), updatePost);

router.get("/post", getPosts);

router.get("/post/:id", getSinglePost);

router.post("/post/:id/clap", verifyToken, clapPost);

router.post("/post/:id/repost", verifyToken, repostPost);


export default router;