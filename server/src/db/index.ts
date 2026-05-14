import mongoose from "mongoose";
import { env } from "../env.js";
const connectDB = async () => {
  const conn = await mongoose.connect(env.MONGODB_URI);
  //what is inside this conn
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
