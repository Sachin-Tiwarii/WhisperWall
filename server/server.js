const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://whisperwall-s.vercel.app",
      "https://whisperwall-5tbvksexp-sachins-projects-4df84b7d.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());
