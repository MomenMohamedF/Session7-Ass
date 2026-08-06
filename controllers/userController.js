import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL?.trim().replace(/;$/, "");
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL environment variable is required");
}

const client = new MongoClient(MONGODB_URL);

await client.connect();

console.log("MongoDB connected successfully");

const db = client.db("DatabaseTest");

const Users = db.collection("users");

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
};

const getAll = async (req, res) => {
  try {
    const minAge = Number(req.query.minAge ?? 14);
    const users = await Users.aggregate([
      { $addFields: { age: { $toInt: "$age" } } },
      { $match: { age: { $gte: minAge } } },
    ]).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addUser = async (req, res) => {
  const { name, id, age } = req.body;

  if (!name || !id || age === undefined) {
    return res.status(400).json({ error: "name, id and age are required" });
  }

  const numericAge = Number(age);
  if (Number.isNaN(numericAge)) {
    return res.status(400).json({ error: "age must be a valid number" });
  }

  const existingUser = await Users.findOne({ id });
  if (existingUser) {
    return res.status(409).json({ error: "User with this id already exists" });
  }

  const user = { name, id, age: numericAge };
  await Users.insertOne(user);

  res.status(201).json(user);
};

const deleteUserById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const existingUser = await Users.findOne({ id });
  if (!existingUser) {
    return res.status(404).json({ error: "User with this id not found" });
  }

  const user = { id };
  await Users.deleteOne(user);

  res.status(200).json(user);
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id parameter is required" });
  }

  if (name === undefined && age === undefined) {
    return res.status(400).json({ error: "name or age is required" });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (age !== undefined) {
    const numericAge = Number(age);
    if (Number.isNaN(numericAge)) {
      return res.status(400).json({ error: "age must be a valid number" });
    }
    updateFields.age = numericAge;
  }

  try {
    const result = await Users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await Users.findOne({ _id: new ObjectId(id) });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getUserById, addUser, getAll, deleteUserById, updateUserById };
