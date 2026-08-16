import mongoose from "mongoose";
import bcrypt from "bcrypt";

const postSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, message: "Text is required" },
    imageUrl: { type: [String], default: [] },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      message: "User id is required",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
