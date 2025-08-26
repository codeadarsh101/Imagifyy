import mongoose from "mongoose";
  

  // Defining schemas..
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
        email:{
            type:String,
            required:true,
            unique:true
        },

        password:{
           type:String,
           required:true
        },

        creditBalance:{
            type:Number,
            default:7
        }
    
})

  const userModel =mongoose.model("user",userSchema)  // Build users collection..

  export default userModel