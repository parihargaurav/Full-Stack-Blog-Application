import express from "express";

import {
  createPost,
  updatePost,
  getPosts,
  getSinglePost,
  deletePost,
  clapPost,
  repostPost,
} from "../controllers/postController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/post", verifyToken, (req, res, next) => {
  uploadMiddleware.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error (create):", err);
      return res.status(400).json({ message: err.message || String(err) });
    }
    next();
  });
}, createPost);

router.put("/post", (req, res, next) => {
  uploadMiddleware.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error (update):", err);
      return res.status(400).json({ message: err.message || String(err) });
    }
    next();
  });
}, updatePost);

router.get("/post", getPosts);

router.get("/post/:id", getSinglePost);

router.delete("/post/:id", verifyToken, deletePost);

router.post("/post/:id/clap", verifyToken, clapPost);

router.post("/post/:id/repost", verifyToken, repostPost);


export default router;