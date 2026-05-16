// routes/commentRoutes.js
import express from "express";
import { getComments, createComment, deleteComment } from "../controllers/commentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET all comments for a post (top‑level + replies)
router.get("/:postId", getComments);

// POST a new comment (authenticated)
router.post("/:postId", verifyToken, createComment);

// DELETE a comment (owns it)
router.delete("/:id", verifyToken, deleteComment);

export default router;