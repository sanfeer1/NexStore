import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Warning/Error: ${error.message}`);
    console.warn(
      `[MongoDB] If using MongoDB Atlas, make sure MONGO_URI in backend/.env is set properly with your connection string.`
    );
  }
};
