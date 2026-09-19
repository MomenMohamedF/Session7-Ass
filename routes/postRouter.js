import express from "express";
import {
  getAllPosts,
  getPostById,
  addPost,
  deletePostById,
  updatePostById,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", protect, addPost);
router.delete("/:id", deletePostById);
router.put("/:id", updatePostById);

export default router;
