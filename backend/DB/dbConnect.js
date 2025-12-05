/*import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("📡 Connecting to MongoDB...");
    console.log("Resolved MONGO_URI:", uri);

    if (!uri || typeof uri !== "string") {
      throw new Error("MONGO_URI is missing or not a string");
    }

    const conn = await mongoose.connect(uri); // ✅ no options needed
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default dbConnect;
*/

import mongoose from "mongoose";

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT),
        console.log("DB connected Succesfully");
    } catch (error) {
        console.log(console.error);
    }
}
 

export default dbConnect
