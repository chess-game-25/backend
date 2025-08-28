import express from "express";
import authRouter from "./routers/auth";

const PORT = 3000;
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});