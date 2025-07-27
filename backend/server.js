import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import questionRouter from "./routes/questionRouter.js";
import adminRouter from "./routes/adminRouter.js";
import connectDB from "./database/db.js";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
const app = express();

// app.use(
//   cors({
//     origin:
//       "http://localhost:5173" ||
//       process.env.CLIENT_URL ||
//       "https://revizited.netlify.app",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "https://revizited.netlify.app",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

app.use("/api/user", authRouter);
app.use("/api/questions", questionRouter);
app.use("/api/admin", adminRouter);
connectDB();

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app is running at port ${PORT}`));
