import { useEffect, useState } from "react";
import API from "../utils/api";
import { Heart, MessageSquare, FileText } from "lucide-react";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/confessions");

        const myPosts = res.data.filter((p) => {
          if (!p.user) return false;

          if (typeof p.user === "string") {
            return p.user === userId;
          }

          return p.user._id === userId;
        });

        setPosts(myPosts);

        const userRes = await API.get("/auth/me");
        setUser(userRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [userId]);

  const totalLikes = posts.reduce(
    (acc, post) => acc + post.likes.length,
    0
  );

  const totalComments = posts.reduce(
    (acc, post) => acc + post.comments.length,
    0
  );

  const topPost =
    posts.length > 0
      ? [...posts].sort((a, b) => b.likes.length - a.likes.length)[0]
      : null;

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-10">

      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-700">
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              {user?.email || "Anonymous User"}
            </h2>
            <p className="text-sm text-zinc-400">
              Joined{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<FileText />} title="Total Posts" value={posts.length} />
        <StatCard icon={<Heart />} title="Total Likes" value={totalLikes} />
        <StatCard icon={<MessageSquare />} title="Total Comments" value={totalComments} />
      </div>

      {topPost && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="mb-4 text-lg font-semibold">Top Post</h3>
          <p>{topPost.text}</p>
          <p className="text-sm text-purple-400 mt-3">
            {topPost.likes.length} Likes
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <div className="text-purple-400 mb-4">{icon}</div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-zinc-400 mt-1">{title}</p>
    </div>
  );
}

export default Profile;
