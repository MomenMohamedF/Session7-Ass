import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/user.js";

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const getPostById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "Invalid post id" });

  const post = await Post.findById(id).populate("userId", "name email");
  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json(post);
};

const getAllPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      if (!isValidObjectId(req.query.userId)) {
        return res.status(400).json({ error: "Invalid userId filter" });
      }
      filter.userId = req.query.userId;
    }

    const posts = await Post.find(filter).populate("userId", "name email");
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addPost = async (req, res) => {
  const { text, imageUrl } = req.body;

  console.log("req.user", req.user);

  const userId = req.user?.userId;

  if (!text) return res.status(400).json({ error: "text is required" });
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Valid authentication token is required" });
  }

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const postData = { text, userId };
  if (imageUrl) {
    postData.imageUrl = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
  }

  try {
    const userExists = await User.findById(userId).select("_id");
    if (!userExists) return res.status(404).json({ error: "User not found" });

    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

const deletePostById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "Invalid post id" });

  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) return res.status(404).json({ error: "Post not found" });

  res.status(200).json(deletedPost);
};

const updatePostById = async (req, res) => {
  const { id } = req.params;
  const { text, imageUrl, userId } = req.body;

  if (!isValidObjectId(id))
    return res.status(400).json({ error: "Invalid post id" });

  if (userId !== undefined && !isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const updateFields = {};
  if (text !== undefined) updateFields.text = text;
  if (imageUrl !== undefined)
    updateFields.imageUrl = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
  if (userId !== undefined) updateFields.userId = userId;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getPostById, addPost, getAllPosts, deletePostById, updatePostById };
