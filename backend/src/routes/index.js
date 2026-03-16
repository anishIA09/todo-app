import express from "express";
import authRoutes from "./auth.route.js";
import usersRoutes from "./users.route.js";
import planRoutes from "./plan.route.js";
import orderRoutes from "./order.route.js";

const app = express();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1", orderRoutes);

export default app;
