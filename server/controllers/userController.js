import userModel from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay"; 
import transactionModel from "../models/transcationModel.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "Missing credentials",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData); //apply modelSchema on the User..
    const user = await newUser.save(); //saves the user in db..

    // Gives token when user Signup...
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "user doesn't exists",
      });
    }
    // Now check Password
    const isMatch = await bcrypt.compare(password, user.password);

    // Gives token when user Login...
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
        user: {
          name: user.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId); // ✅ use req.userId
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });



 export const paymentRazorpay = async (req, res) => {
  try {
   
    
    const { planId } = req.body;
    const userId = req.userId;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic": plan = "Basic"; credits = 100; amount = 20; break;
      case "Advanced": plan = "Advanced"; credits = 500; amount = 50; break;
      case "Business": plan = "Business"; credits = 2000; amount = 100; break;
      default: return res.json({ success: false, message: "Plan not found" });
    }

    const newTransaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    });

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
   
    res.json({ success: false, message: error.message });
  }
}; 

 export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(orderInfo.receipt);

      if (transactionData.payment) {
        return res.json({ message: "Payment already Verified" });
      }

      const userData = await userModel.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;

      await userModel.findByIdAndUpdate(userData._id, { creditBalance });
      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

      res.json({ success: true, message: "Credit Added" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}; 
