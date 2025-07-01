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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/user", authRouter);
app.use("/api/questions", questionRouter);
connectDB();

app.listen("3000", () => console.log("app is running at port 3000"));
