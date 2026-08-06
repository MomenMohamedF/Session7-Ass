import express from "express";
import {
  getAll,
  getUserById,
  addUser,
  deleteUserById,
  updateUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getUserById);
router.post("/", addUser);
router.delete("/:id", deleteUserById);
router.put("/:id", updateUserById);

export default router;
