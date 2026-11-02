import mongoose from 'mongoose';

const FALLBACK_MONGO_URI = 'mongodb://dineshyt50_db_user:p.qrtN4T_hD3quS@ac-zn6ggv5-shard-00-02.1qk7ujy.mongodb.net:27017/healthcare?ssl=true&replicaSet=atlas-i3jdsy-shard-0&authSource=admin';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || FALLBACK_MONGO_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // In production deployments, log the error rather than hard crashing immediately
    console.error('[MongoDB] Please ensure MONGO_URI is properly set in your hosting environment variables.');
    process.exit(1);
  }
};
