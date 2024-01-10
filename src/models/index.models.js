import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(process.env.DB_NAME)
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

export default mongoose