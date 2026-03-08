import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../models/User.js'
import {sendEmail} from '../utils/sendEmail.js'
import { generateToken } from '../utils/token.js'
import {redis} from '../config/redis.js'
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import admin from "../utils/firebaseAdmin.js";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const emailKey = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailKey });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email: emailKey, password: hashedPassword, role: role || "user" });
    await user.save();

    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    // --- Store in users hash ---
    await redis.hset("users", {
      [emailKey] : JSON.stringify(userData)
    });
    console.log(`User stored in 'users' hash in signup : ${emailKey}-->${JSON.stringify(userData)}`);

    return res.status(200).json({ success: true, message: "Signup successful", user: userData });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Error in signup",
      error: err instanceof Error ? err.message : JSON.stringify(err)
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const emailKey = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailKey });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    // --- Generate JWT ---
    const token = await generateToken(user);
    const tokenString = typeof token === "string" ? token : String(token);

    
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token:tokenString,
    };
      
    await redis.set(`token:${emailKey}`,tokenString);

     await redis.hset("users",{
      [emailKey] : JSON.stringify(userData)
     })
    // --- Send login email if needed ---
    sendEmail({
      to: user.email,
      subject: "You have Logged In Successfully",
      html: `
        <div>
          <h2>Hello ${user.name}, 👋</h2>
          <p>You have successfully logged in.</p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: tokenString,
      user: userData
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Error in login",
      error: err instanceof Error ? err.message : JSON.stringify(err),
    });
  }
};


export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    // Remove token from hash
    await redis.hdel("tokens", email);
    console.log(`Token removed for ${email}`);

    return res.status(200).json({ success: true, message: "Logout successful" });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Error in logout",
      error: err instanceof Error ? err.message : JSON.stringify(err)
    });
  }
};


export const forgotPassword = async (req,res)=>{
    try{
  const {email} = req.body;
  const user = await User.findOne({email:email.trim().toLowerCase()});
  if(!user){
    return res.status(400).json({success:false,message:"User not found"});

  }

  //generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  //hash token before saving 

  user.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  //token valid for 15 mins
  user.resetPasswordExpire = Date.now() + 15 * 60 *1000;
  await user.save();


 const resetUrl = `${process.env.FRONTEND_URL_FOR_RESET_PASSWORD}/reset-password/${resetToken}`;


  await sendEmail({
    to:user.email,
    subject:"Password Reset Request",
    html:`
    <h2>Hello ${user.name}</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 15 minutes.</p>
    `
  })

  return res.status(200).json({success:true,message:"Reset link sent to your  Email",resetToken:resetToken});
    }catch(err){
        return res.status(500).json({success:false,message:"Error in forgot password",error:err.message});
    }
}

export const resetPassword = async (req,res)=>{
    const {token} = req.params;
    const {newPassword} = req.body;

    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken : hashedToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  //hash new password

  user.password = await bcrypt.hash(newPassword,10);

  //clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return  res.json({success:true,message:"Password reset successful"});

}



export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    // Get user from MongoDB
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    // Set new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Optionally update Redis hash if you store users there
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    await redis.hset("users", { [user.email]: JSON.stringify(userData) });

    return res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ success: false, message: "Error changing password", error: err.message });
  }
};


// server/controllers/authController.js


export const oauthLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No token provided" });
    }

    // 🔥 Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
  console.log("Firebase token : ",idToken);
    const { email, name} = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "", // Google user
        role: "user",
      });
    }

    // Generate YOUR JWT
    const token = user.generateJWT();

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};