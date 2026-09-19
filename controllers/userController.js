import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken, verifyToken } from "../config/jwt.js";

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
};

const getAll = async (req, res) => {
  try {
    const minAge =
      req.query.minAge !== undefined ? Number(req.query.minAge) : null;
    const filter = {};
    if (minAge !== null && !Number.isNaN(minAge)) {
      filter.age = { $gte: minAge };
    }

    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addUser = async (req, res) => {
  const { name, email, age, role, password, dateOfBirth } = req.body;
  if (!name || !password || !dateOfBirth) {
    return res
      .status(400)
      .json({ error: "name, password and dateOfBirth are required" });
  }

  const userData = { name, password, dateOfBirth };
  if (email) userData.email = email;
  if (role) userData.role = role;
  if (age !== undefined) {
    const numericAge = Number(age);
    if (Number.isNaN(numericAge)) {
      return res.status(400).json({ error: "age must be a valid number" });
    }
    userData.age = numericAge;
  }

  try {
    const user = await User.create(userData);
    const token = signToken(user);
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = error.keyValue
        ? Object.keys(error.keyValue)[0]
        : "field";
      return res.status(409).json({
        error: `Duplicate ${duplicateField} value`,
      });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(deletedUser);
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, age, role, password, dateOfBirth } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  if (
    name === undefined &&
    email === undefined &&
    age === undefined &&
    role === undefined &&
    password === undefined &&
    dateOfBirth === undefined
  ) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (email !== undefined) updateFields.email = email;
  if (role !== undefined) updateFields.role = role;
  if (password !== undefined) updateFields.password = password;
  if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
  if (age !== undefined) {
    const numericAge = Number(age);
    if (Number.isNaN(numericAge)) {
      return res.status(400).json({ error: "age must be a valid number" });
    }
    updateFields.age = numericAge;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = error.keyValue
        ? Object.keys(error.keyValue)[0]
        : "field";
      return res.status(409).json({
        error: `Duplicate ${duplicateField} value`,
      });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.logoutTime = new Date();
    await user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(400).json({
      message: err.message || "Logout Failed",
    });
  }
};

export {
  getUserById,
  addUser,
  getAll,
  deleteUserById,
  updateUserById,
  login,
  logout,
};
