import express from "express";
import {
  getAll,
  getUserById,
  addUser,
  deleteUserById,
  updateUserById,
  login,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAll);
router.post("/login", login);
router.post("/logout", logout);
router.post("/", addUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);
router.put("/:id", updateUserById);

export default router;
