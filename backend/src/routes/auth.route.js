import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {
  console.log("req", req.body);
  res.send("helo world");
});

export default router;
