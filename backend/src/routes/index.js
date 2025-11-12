import express from "express";
import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";

const app = express();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);

export default app;
