import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB is connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting DB - ${error.message}`);
    process.exit();
  }
};
