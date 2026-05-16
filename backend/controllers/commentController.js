// controllers/commentController.js
import Comment from "../models/Comment.js";

// GET /api/comments/:postId — get all top‑level comments + their replies
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null, // top‑level only
    })
      .populate("author", "username profilePic")
      .sort({ createdAt: -1 });

    const withReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
        })
          .populate("author", "username profilePic")
          .sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );

    res.json(withReplies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/comments/:postId — create a comment
export const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const comment = new Comment({
      post: req.params.postId,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
    });

    await comment.save();
    await comment.populate("author", "username profilePic");

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/comments/:id — delete own comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};