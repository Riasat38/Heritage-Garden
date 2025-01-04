`use strict`;
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
const uri = process.env.MONGO_URI;
const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(uri)
    
        console.log(`MongoDb connected ${conn.connection.host}`);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default  connectDB; 