import dns from "node:dns";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const uri = process.env.MONGODB_URL?.trim().replace(/;$/, "");

console.log("Testing MongoDB connection...");

const client = new MongoClient(uri);

try {
  await client.connect();

  console.log("✅ MongoDB connected successfully!");

  await client.db("DatabaseTest").command({ ping: 1 });

  console.log("✅ MongoDB ping successful!");
} catch (error) {
  console.error("❌ MongoDB connection failed:");
  console.error(error);
} finally {
  await client.close();
}
