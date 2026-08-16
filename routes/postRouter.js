import express from "express";
import {
  getAllPosts,
  getPostById,
  addPost,
  deletePostById,
  updatePostById,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", addPost);
router.delete("/:id", deletePostById);
router.put("/:id", updatePostById);

export default router;
