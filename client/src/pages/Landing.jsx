import { Link } from "react-router-dom";
import { Shield, Flame, Heart, ArrowRight } from "lucide-react";

function Landing() {
  return (
    <div className="bg-black text-white relative overflow-hidden md:h-screen">

      {/* Animated Background Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-700 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-600 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none"></div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-pink-900/10 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:h-screen">

        <div className="px-6 md:px-20 py-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            WhisperWall
          </h1>
        </div>

        <div className="flex flex-col items-center text-center px-6 md:px-20 md:flex-1 md:justify-center animate-fadeIn">

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Speak Freely.
            <br className="hidden md:block" />
            Stay Anonymous.
          </h2>

          <p className="text-zinc-400 max-w-2xl mb-8 text-sm md:text-lg">
            WhisperWall is your safe space to share thoughts without fear,
            identity, or judgment. Real emotions. Real stories. Pure anonymity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">

            <Link
              to="/register"
              className="group bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/40 hover:scale-105"
            >
              Start Sharing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/login"
              className="border border-zinc-700 hover:border-purple-500 px-8 py-3 rounded-xl transition-all duration-300 hover:bg-zinc-800 hover:scale-105"
            >
              Login
            </Link>

          </div>
        </div>

        <div className="px-6 md:px-20 pb-8">
          <div className="grid md:grid-cols-3 gap-8">

            <div className="group bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition-all duration-300 shadow-xl hover:-translate-y-2 hover:shadow-purple-500/20">
              <Shield className="mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" size={32} />
              <h3 className="text-lg font-semibold mb-3">100% Anonymous</h3>
              <p className="text-zinc-400 text-sm">
                Your identity is never shown. Share freely without fear.
              </p>
            </div>

            <div className="group bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition-all duration-300 shadow-xl hover:-translate-y-2 hover:shadow-purple-500/20">
              <Flame className="mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" size={32} />
              <h3 className="text-lg font-semibold mb-3">Trending Confessions</h3>
              <p className="text-zinc-400 text-sm">
                Discover the most liked confessions in real time.
              </p>
            </div>

            <div className="group bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition-all duration-300 shadow-xl hover:-translate-y-2 hover:shadow-purple-500/20">
              <Heart className="mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" size={32} />
              <h3 className="text-lg font-semibold mb-3">Engage & Connect</h3>
              <p className="text-zinc-400 text-sm">
                Like and comment while staying completely private.
              </p>
            </div>

          </div>
            </div>

        <div className="py-6 text-center border-t border-zinc-800">
          <p className="text-zinc-500 text-sm tracking-wide">
            © {new Date().getFullYear()} WhisperWall. Built with privacy in mind.
            <span className="text-purple-500 font-medium ml-1 hover:text-purple-400 transition">
              Crafted by Sachin
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Landing;