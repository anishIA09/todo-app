import express from "express";
import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";
import planRoutes from "./plan.route.js";

const app = express();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/plans", planRoutes);

export default app;
