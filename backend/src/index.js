import dotenv from "dotenv";
import connectToDb from "./db/index.js";
import app from "./app.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({ path: "./.env" });

connectToDb()
  .then(() => {
    const PORT = process.env.PORT;

    app.use((err, req, res, next) => {
      console.log("Global error. ", err);

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong.",
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed: ", error);
  });
