import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
  res.send("Signup");
});

router.post("/signin", (req, res) => {
  res.send("Signin");
});

export default router;