import mongoose from "mongoose";
export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Database Connected Successfully!");
  } catch (error) {
    console.log("🔴 Database connection error: ", error.message);
  }
}
