import mongoose from "mongoose";

const connectDB =async ()=>{

  await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
   console.log('DB connected');
   

    
}
 
export default connectDB
