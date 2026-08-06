import express from "express";
import morgan from "morgan";

import userRouter from "./routes/userRouter.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/user", userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
