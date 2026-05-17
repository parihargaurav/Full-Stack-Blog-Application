import { useState, useEffect } from "react";

function CommentItem({ comment, onReply, currentUserId, onDelete }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = async () => {
    if (!replyText.trim()) return;
    await onReply(replyText, comment._id);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
        💬
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">
            {comment.author?.username}
          </span>
          <span className="text-xs text-gray-600">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-xs text-gray-600 hover:text-green-600 transition-colors"
          >
            Reply
          </button>
          {comment.author?._id === currentUserId && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-xs text-gray-600 hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {showReplyBox && (
          <div className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={submitReply}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
            >
              Reply
            </button>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply._id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                  💬
                </div>
                <div>
                  <span className="font-semibold text-xs text-gray-900">
                    {reply.author?.username}
                  </span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentsSection({ postId, currentUserId, checkAuth }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/comments/${postId}`, {
        credentials: "include", //  full URL + cookie
      });
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!checkAuth()) return;
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:4000/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //  removed localStorage token + Authorization header
        },
        credentials: "include", //  sends cookie
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();
      setComments([{ ...data, replies: [] }, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (content, parentComment) => {
    if (!checkAuth()) return;
    try {
      const response = await fetch(`http://localhost:4000/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //  removed localStorage token + Authorization header
        },
        credentials: "include", //  sends cookie
        body: JSON.stringify({ content, parentComment }),
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();

      setComments((prev) =>
        prev.map((c) =>
          c._id === parentComment
            ? { ...c, replies: [...(c.replies || []), data] }
            : c,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include", //  sends cookie
          //  removed localStorage token + Authorization header
        },
      );

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Responses ({comments.length})
      </h3>

      {/* New comment input */}
      <div className="border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          rows={3}
          className="w-full text-sm text-gray-700 resize-none focus:outline-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={submitComment}
            disabled={!newComment.trim()}
            className="bg-green-600 text-white text-sm px-5 py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Respond
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-600 text-sm">Loading responses...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No responses yet. Be the first to respond!
        </p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
