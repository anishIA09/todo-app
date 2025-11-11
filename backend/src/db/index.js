import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully. 🚀");
  } catch (error) {
    console.log("MONGODB connection failed. ", error);
    process.exit(1);
  }
};

export default connectToDb;
