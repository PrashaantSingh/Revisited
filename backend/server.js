import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import questionRouter from "./routes/questionRouter.js";
import connectDB from "./database/db.js";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
const app = express();
// app.use(
//   cors({
//     origin:
//       "http://localhost:5174" ||
//       process.env.CLIENT_URL ||
//       "https://revizited.netlify.app",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// const allowedOrigins = [
//   "https://revizited.netlify.app",
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.error("Blocked by CORS:", origin);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(helmet());
app.use(express.json());

app.use("/api/user", authRouter);
app.use("/api/questions", questionRouter);
connectDB();

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app is running at port ${PORT}`));
