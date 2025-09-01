import express from "express";
import authRouter from "./routers/auth";
import roomRouter from "./routers/room";
import referralRouter from "./routers/referral";
import cors from "cors";

import { debugValue } from "./utils";

const PORT = process.env.PORT ?? 8000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/referral", referralRouter);

app.listen(PORT, () => {
  debugValue(`Server is running on port ${PORT}`, "Server Startup");
});