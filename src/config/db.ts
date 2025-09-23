import mongoose from 'mongoose';

export const connectDB = async () => {
  console.log('start connect db',process.env.MONGO_URI);
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/node-mvc-ts-full';
  
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};
