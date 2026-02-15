import { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  Send,
  MessageCircle,
  Crown,
  Flag,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

function Feed() {
  const [confessions, setConfessions] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [likeAnimationId, setLikeAnimationId] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [expandedComments, setExpandedComments] = useState({});
  const [reportedPostId, setReportedPostId] = useState(null);

  const [reportData, setReportData] = useState(null);
  const [reportReason, setReportReason] = useState("");

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const fetchConfessions = async () => {
    try {
      const res = await API.get("/confessions");
      setConfessions(res.data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const sortedConfessions = useMemo(() => {
    const copy = [...confessions];
    switch (sortType) {
      case "newest":
        return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "likes":
        return copy.sort((a, b) => b.likes.length - a.likes.length);
      case "comments":
        return copy.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return copy;
    }
  }, [confessions, sortType]);

  const trendingPost =
    confessions.length > 0
      ? [...confessions].sort(
          (a, b) =>
            b.likes.length + b.comments.length -
            (a.likes.length + a.comments.length)
        )[0]
      : null;

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await API.post("/confessions", { text });
      setConfessions([res.data, ...confessions]);
      setText("");
      toast.success("Posted");
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ LIKE FIX (big heart animation works now)
  const handleLike = async (id) => {
    try {
      const res = await API.put(`/confessions/${id}/like`);
      setConfessions((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );

      setLikeAnimationId(id);
      setTimeout(() => setLikeAnimationId(null), 700);
    } catch {
      toast.error("Failed");
    }
  };

  const handleComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/confessions/${id}/comment`, {
        text: commentText,
      });

      setConfessions((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );

      setCommentText("");
      setActiveCommentId(null);
    } catch {
      toast.error("Failed");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await API.delete(`/confessions/${id}`);
      setConfessions((prev) => prev.filter((c) => c._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await API.delete(`/confessions/${postId}/comment/${commentId}`);
      setConfessions((prev) =>
        prev.map((c) =>
          c._id === postId
            ? {
                ...c,
                comments: c.comments.filter((cm) => cm._id !== commentId),
              }
            : c
        )
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ REPORT FIXED (modal + correct call)
  const submitReport = async () => {
    if (!reportReason || !reportData) return;

    try {
      await API.post(`/reports/post/${reportData.id}`, {
        reason: reportReason,
      });

      setReportedPostId(reportData.id);
      toast.success("Reported successfully");
    } catch {
      toast.error("Report failed");
    }

    setReportData(null);
    setReportReason("");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-10">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          WhisperWall
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* FILTER BAR SAME */}
      <div className="flex gap-3 mb-6 text-sm">
        {["newest", "oldest", "likes", "comments"].map((type) => (
          <button
            key={type}
            onClick={() => setSortType(type)}
            className={`px-4 py-2 rounded-lg border ${
              sortType === type
                ? "bg-purple-600 border-purple-600"
                : "bg-zinc-900 border-zinc-700"
            }`}
          >
            {type === "likes"
              ? "Most Liked"
              : type === "comments"
              ? "Most Commented"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* FORM SAME */}
      <form
        onSubmit={handlePost}
        className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 mb-10"
      >
        <textarea
          rows="4"
          maxLength={280}
          placeholder="Share something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none"
        />
        <div className="flex justify-between mt-4">
          <span className="text-xs text-zinc-500">
            {text.length}/280
          </span>
          <button className="bg-purple-600 px-4 py-2 rounded-xl flex items-center gap-2">
            <Send size={16} />
            Post
          </button>
        </div>
      </form>

      {!loading &&
        sortedConfessions.map((conf) => {

          const isExpanded = expandedComments[conf._id];
          const commentsToShow = isExpanded
            ? conf.comments
            : conf.comments?.slice(0, 2);

          const isTrending = trendingPost?._id === conf._id;
          const isLiked = conf.likes?.includes(currentUserId);

          const postOwner =
            (typeof conf.user === "string"
              ? conf.user
              : conf.user?._id) === currentUserId;

          return (
            <div
              key={conf._id}
              className="relative bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8 overflow-hidden"
            >

              {isTrending && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-yellow-400 text-xs">
                  <Crown size={16} />
                  Trending
                </div>
              )}

              {/* YOUR ORIGINAL PFP + NAME LEFT SAME */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                  <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${conf._id}`}
                    alt="avatar"
                  />
                </div>
                <span className="text-sm text-zinc-300">
                  Anonymous User
                </span>
              </div>

              <p className="mb-4">{conf.text}</p>

              <div className="flex justify-between text-sm text-zinc-400">
                <span>
                  {conf.likes.length} Likes • {conf.comments.length} Comments
                </span>

                <div className="flex gap-5 items-center">

                  <button onClick={() => handleLike(conf._id)} className="relative">
                    <Heart
                      size={18}
                      className={isLiked ? "text-purple-500 fill-purple-500" : ""}
                    />

                    {likeAnimationId === conf._id && (
                      <Heart
                        size={90}
                        className="absolute -top-12 -left-8 text-purple-500 animate-ping opacity-70"
                      />
                    )}
                  </button>

                  <button onClick={() => setActiveCommentId(conf._id)}>
                    <MessageCircle size={18} />
                  </button>

                  <button onClick={() => setReportData({ id: conf._id })}>
                    <Flag size={16} />
                  </button>

                  {postOwner && (
                    <button
                      onClick={() => handleDeletePost(conf._id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                </div>
              </div>

              {/* COMMENTS SAME */}
              <div className="mt-4 space-y-3">
                {commentsToShow?.map((c) => {

                  const commentOwner =
                    (typeof c.user === "string"
                      ? c.user
                      : c.user?._id) === currentUserId;

                  return (
                    <div key={c._id} className="bg-zinc-800 p-3 rounded-lg text-sm flex justify-between items-start">
                      <div>
                        <span className="text-xs text-zinc-400">
                          Anonymous
                        </span>
                        <p>{c.text}</p>
                      </div>

                      {commentOwner && (
                        <button
                          onClick={() =>
                            handleDeleteComment(conf._id, c._id)
                          }
                          className="text-red-500 ml-3"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {conf.comments?.length > 2 && (
                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [conf._id]: !prev[conf._id],
                      }))
                    }
                    className="text-purple-400 text-xs"
                  >
                    {isExpanded ? "View less" : "View more comments"}
                  </button>
                )}
              </div>

              {activeCommentId === conf._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-sm"
                  />
                  <button
                    onClick={() => handleComment(conf._id)}
                    className="bg-purple-600 px-3 rounded-lg text-sm"
                  >
                    Post
                  </button>
                </div>
              )}

            </div>
          );
        })}

      {/* REPORT MODAL BACK */}
      {reportData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-96">
            <h3 className="mb-4">Report Content</h3>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg mb-6"
            >
              <option value="">Select reason</option>
              <option value="Spam">Spam</option>
              <option value="Abuse">Abuse</option>
              <option value="Hate">Hate Speech</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setReportData(null)}
                className="px-4 py-2 bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Feed;
