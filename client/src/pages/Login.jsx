import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    toast.error("Enter a valid email address");
    return;
  }

  if (!password) {
    toast.error("Password cannot be empty");
    return;
  }

  try {
    setLoading(true);

    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("role", res.data.role);

    toast.success("Welcome back!");

   
    if (res.data.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/feed", { replace: true });
    }

  } catch {
    toast.error("Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-4">

      <div className="absolute w-[600px] h-[600px] bg-purple-700 opacity-20 blur-3xl rounded-full top-[-200px] left-[-200px] animate-pulse"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl transition-all duration-300 hover:shadow-purple-900/30"
      >
        <div className="flex items-center justify-center gap-2">
          <LogIn className="text-purple-500" />
        </div>

        <div className="relative group">
          <Mail className="absolute top-3 left-3 text-zinc-500 group-focus-within:text-purple-500 transition" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-purple-600 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute top-3 left-3 text-zinc-500 group-focus-within:text-purple-500 transition" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-black border border-zinc-700 rounded-xl p-3 pl-10 pr-10 focus:ring-2 focus:ring-purple-600 outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-3 right-3 text-zinc-500 hover:text-purple-400 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-500 hover:text-purple-400 transition"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;