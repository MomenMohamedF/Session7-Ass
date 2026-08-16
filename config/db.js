import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDatabase() {
  const uri = process.env.MONGODB_URL?.trim().replace(/;$/, "");
  if (!uri) {
    throw new Error("MONGODB_URL environment variable is required");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}

export default connectToDatabase;
