import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import questionRouter from "./routes/questionRouter.js";
import connectDB from "./database/db.js";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
dotenv.config();
const app = express();
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://revizited.netlify.app",
    credentials: true,
  })
);
app.use("/api/user", authRouter);
app.use("/api/questions", questionRouter);
connectDB();

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app is running at port ${PORT}`));
