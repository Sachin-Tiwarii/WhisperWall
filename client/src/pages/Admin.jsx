import { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import {
  Users,
  FileText,
  MessageSquare,
  Heart,
  Trash2,
  ShieldCheck,
  Flag
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import toast from "react-hot-toast";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchPosts, setSearchPosts] = useState("");
  const [confirmData, setConfirmData] = useState(null);

  const fetchData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      const postsRes = await API.get("/admin/posts");
      const reportsRes = await API.get("/admin/reports");

      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setReports(reportsRes.data);
    } catch {
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalComments = posts.reduce(
    (acc, post) => acc + post.comments.length,
    0
  );

  const totalLikes = posts.reduce(
    (acc, post) => acc + post.likes.length,
    0
  );

  const chartData = useMemo(() => {
    const grouped = {};

    posts.forEach((post) => {
      const date = new Date(post.createdAt).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.keys(grouped).map((date) => ({
      date,
      posts: grouped[date]
    }));
  }, [posts]);

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredPosts = posts.filter((p) =>
    p.text.toLowerCase().includes(searchPosts.toLowerCase())
  );

  const confirmDelete = async () => {
    try {
      if (confirmData.type === "post") {
        await API.delete(`/admin/post/${confirmData.id}`);
        setPosts(posts.filter((p) => p._id !== confirmData.id));
      }

      if (confirmData.type === "user") {
        await API.delete(`/admin/user/${confirmData.id}`);
        setUsers(users.filter((u) => u._id !== confirmData.id));
      }

      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }

    setConfirmData(null);
  };

  const resolveReport = async (id) => {
    try {
      await API.put(`/admin/report/${id}/resolve`);
      setReports(reports.filter((r) => r._id !== id));
      toast.success("Report resolved");
    } catch {
      toast.error("Failed to resolve report");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f15] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#15151d] border-r border-zinc-800 p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-semibold mb-8">Admin Panel</h2>

          {["dashboard", "posts", "users", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition mb-2 ${
                activeTab === tab
                  ? "bg-purple-600"
                  : "hover:bg-zinc-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
            <ShieldCheck size={16} className="text-green-400" />
            <span>System Status</span>
          </div>

          <div className="space-y-3 text-xs">
            <StatusItem title="Server" status="Running" />
            <StatusItem title="Database" status="Connected" />
            <StatusItem title="Platform Health" status="Stable" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-2xl font-semibold mb-8">
              Analytics Overview
            </h1>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<Users />} title="Users" value={users.length} />
              <StatCard icon={<FileText />} title="Posts" value={posts.length} />
              <StatCard icon={<MessageSquare />} title="Comments" value={totalComments} />
              <StatCard icon={<Heart />} title="Likes" value={totalLikes} />
            </div>

            <div className="bg-[#15151d] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-lg mb-6">Posts Activity</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#a855f7"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* POSTS */}
        {activeTab === "posts" && (
          <>
            <h1 className="text-2xl font-semibold mb-6">
              Manage Posts
            </h1>

            <input
              placeholder="Search posts..."
              className="mb-6 w-full bg-[#15151d] border border-zinc-800 p-3 rounded-lg"
              value={searchPosts}
              onChange={(e) => setSearchPosts(e.target.value)}
            />

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-[#15151d] p-6 rounded-xl border border-zinc-800"
                >
                  <p className="mb-4">{post.text}</p>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>
                      {post.likes.length} Likes • {post.comments.length} Comments
                    </span>
                    <button
                      onClick={() =>
                        setConfirmData({ type: "post", id: post._id })
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h1 className="text-2xl font-semibold mb-6">
              Manage Users
            </h1>

            <input
              placeholder="Search users..."
              className="mb-6 w-full bg-[#15151d] border border-zinc-800 p-3 rounded-lg"
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
            />

            <div className="space-y-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-[#15151d] p-6 rounded-xl border border-zinc-800 flex justify-between"
                >
                  <div>
                    <p>{user.email}</p>
                    <p className="text-xs text-zinc-500">{user.role}</p>
                  </div>

                  <button
                    onClick={() =>
                      setConfirmData({ type: "user", id: user._id })
                    }
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <>
            <h1 className="text-2xl font-semibold mb-6">
              Reported Content
            </h1>

            <div className="space-y-6">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-[#15151d] p-6 rounded-xl border border-zinc-800"
                >
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <Flag size={16} />
                    <span className="text-sm font-medium">Reported</span>
                  </div>

                  <p className="text-sm mb-1">
                    Type: {report.type}
                  </p>

                  <p className="text-sm mb-1">
                    Reason: {report.reason}
                  </p>

                  <button
                    onClick={() => resolveReport(report._id)}
                    className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-sm"
                  >
                    Mark Resolved
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {confirmData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#15151d] p-6 rounded-xl border border-zinc-800 w-96">
            <h3 className="mb-6 text-lg">Confirm Deletion</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-[#15151d] p-6 rounded-xl border border-zinc-800">
      <div className="mb-4 text-purple-400">{icon}</div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-zinc-400 mt-1">{title}</p>
    </div>
  );
}

function StatusItem({ title, status }) {
  return (
    <div className="flex justify-between text-zinc-400">
      <span>{title}</span>
      <span className="text-green-400">{status}</span>
    </div>
  );
}

export default Admin;