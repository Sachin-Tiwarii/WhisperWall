import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

function CommentBox({ confessionId, refresh }) {
  const [comment, setComment] = useState("");

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await API.post(`/confessions/${confessionId}/comment`, {
        text: comment,
      });
      setComment("");
      refresh();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to comment");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        className="flex-1 bg-black border border-zinc-700 rounded p-2 text-xs"
        placeholder="Write comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleComment}
        className="bg-purple-600 px-3 rounded text-xs"
      >
        Post
      </button>
    </div>
  );
}

export default CommentBox;
