import { response } from "express";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";



export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body; // only prompt comes from body
    const userId = req.userId;  // 👈 take from middleware

    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({
        success: false,
        msg: "Missimg Details",
      });
    }

    if (user.creditBalance == 0 || user.creditBalance < 0) {
      return res.json({
        success: false,
        msg: "No credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

  const {data} =  await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
      },
      responseType: "arraybuffer",
    });

   const base64Image = Buffer.from(data,'binary').toString('base64')
   const resultImage = `data:image/png;base64,${base64Image}`

   await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance-1})
   
    res.json({
      success:true,
      msg:"Image genrated",
      creditBalance:user.creditBalance-1,
      resultImage
    })

  } catch (error) {
    res.json({
       success:false,
       msg:error.msg
    })
    
     
}

};
