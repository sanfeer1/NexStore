import mongoose from 'mongoose';

export const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
  // Automatically sanitize accidental multiple slashes between host and database name
  mongoUri = mongoUri.replace(/(\.mongodb\.net|\.com|\.net|\.org|\d+)\/\/+([a-zA-Z0-9_-]+)/g, '$1/$2');

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Warning/Error: ${error.message}`);
    console.warn(
      `[MongoDB] If using MongoDB Atlas, make sure MONGO_URI in backend/.env is set properly with your connection string.`
    );
  }
};
