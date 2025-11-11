import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);

// All API routes are being used here
app.use(indexRouter);

export default app;
