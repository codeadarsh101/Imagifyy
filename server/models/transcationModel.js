import mongoose from "mongoose";
  

  // Defining schemas..
const transactionSchema = new mongoose.Schema({
     userId:{
        type:String,
        required:true
     },

     plan: {
         type:String,
         required:true
     },

     amount: {
         type:Number,
         required:true
     },
     
     credits: {
         type:Number,
         required:true
     },

     payment:{
        type:Boolean,
        default:false
     },

     date:{
        type:Number
     }

    
})

  const transactionModel =mongoose.model("transaction",transactionSchema)  // Build transactions collection..

  export default transactionModel;