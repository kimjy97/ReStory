import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global as typeof global & { mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.mongoose.conn) {
    console.log("Using existing MongoDB connection");
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.mongoose.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("New MongoDB connection established");
      return mongoose;
    }).catch((error) => {
      console.error("Failed to connect to MongoDB:", error.message);
      throw error;
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;
  } catch (e) {
    cached.mongoose.promise = null;
    throw e;
  }

  return cached.mongoose.conn;
}

export default dbConnect;
