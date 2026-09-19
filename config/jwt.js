import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
