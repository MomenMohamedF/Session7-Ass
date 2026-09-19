import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    age: { type: Number, min: 0 },
    role: { type: String, default: "user" },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    logoutTime: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
