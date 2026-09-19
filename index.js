import express from "express";
import morgan from "morgan";
import connectToDatabase from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";

try {
  await connectToDatabase();
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
}

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON" });
  }

  next(error);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
