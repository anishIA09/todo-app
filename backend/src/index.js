import dotenv from "dotenv";
import connectToDb from "./db.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectToDb()
  .then(() => {
    const PORT = process.env.PORT;

    app.use((err, req, res, next) => {
      console.log("Global error. ", err);
      res.status(500).json({
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
    console.log("MONGODB connection failed. ", error);
  });
