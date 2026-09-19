import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";
import User from "./models/User.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

async function createPosts() {
  const uri = process.env.MONGODB_URL?.trim().replace(/;$/, "");

  if (!uri) {
    console.error("❌ MONGODB_URL environment variable is missing");
    process.exit(1);
  }

  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // البحث عن أول user
    let user = await User.findOne();

    // إذا لم يوجد user، إنشاء واحد
    if (!user) {
      console.log("📝 Creating a new user...");
      user = await User.create({
        name: "Ahmed",
        email: "ahmed@example.com",
        password: "password123",
        dateOfBirth: new Date("1990-01-15"),
        age: 34,
      });
      console.log("✅ User created:", user._id);
    } else {
      console.log("✅ Found existing user:", user._id);
    }

    // البيانات الأربعة posts
    const postsData = [
      {
        text: "هذا أول post - مرحباً بالجميع! 👋",
        imageUrl: ["https://example.com/image1.jpg"],
        userId: user._id,
      },
      {
        text: "Post الثاني - أتمنى أن تستمتعوا بالمحتوى المشاركة معكم 😊",
        imageUrl: ["https://example.com/image2.jpg"],
        userId: user._id,
      },
      {
        text: "Third post - تعلم Node.js و MongoDB أمر رائع جداً! 🚀",
        imageUrl: ["https://example.com/image3.jpg"],
        userId: user._id,
      },
      {
        text: "Post الرابع والأخير - شكراً لكم على المتابعة! ❤️",
        imageUrl: ["https://example.com/image4.jpg"],
        userId: user._id,
      },
    ];

    // إنشاء الـ 4 posts
    console.log("\n📤 Creating 4 posts...\n");
    const createdPosts = await Post.insertMany(postsData);

    console.log("✅ Successfully created 4 posts:\n");
    createdPosts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`);
      console.log(`  ID: ${post._id}`);
      console.log(`  Text: ${post.text}`);
      console.log(`  Created at: ${post.createdAt}`);
      console.log();
    });

    console.log("✅ All posts created successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

createPosts();
