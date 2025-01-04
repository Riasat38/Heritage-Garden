`use strict`
//this file handles log in and signup related funtions
import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendNotification } from "../config/mailer.js";
dotenv.config();


let Blacklisted_tokens= new Set();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })
};
function validateGmail(email) { 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const domain = email.split('@')[1]; 
  return emailPattern.test(email) && domain === 'gmail.com';
};

export const loginUser = async(req, res) => {
    
    const { username,email,password } = await req.body || {}; 
    //console.log(email,flatno,"route"); //test passed
    try {
        if (!username || !email || !password ) {
            return res.status(400).json({ message: 'Invalid data' });
        }
        const user =  await User.findOne({username:username, email:email});
        console.log(user);
        if (!user ){
          return res.status(401).json({message: 'Invalid credentials',
              redirectUrl: '/society/login'});
      }else{
        const id = user._id.toString();
        if (user && await(bcrypt.compare(password, user.password))) {
          
        return res.status(200).json({ message: 'Logged In',
          user,
          token: generateToken(user._id),
          redirectUrl: `/society/homepage` });
        }
        
      }
    } catch(error){
        console.error("Error in /loginPage:", error.message);
        res.status(400).json({ error: error.message,
            redirectUrl: '/society/login' });
    }   
};
    


export const registerUser = async (req,res) => {
  try{
    const {name,username,email,password,flatno,usertype,contactno,role} = req.body || {};
    console.log(username,email,flatno,usertype,contactno,role); //test passed

    if (!email || !username || !password || !name || !usertype || !contactno) {
        throw new Error(`fields missing from url missing`); 
    };
    if (!validateGmail(email)){
      return res.status(400).json({error: `Please Provide a Gmail Address` });
    }

    if (usertype === "maintenance" && !role) {
        return res.status(400).json({ error: "Role is required for maintenance users" });
    } else if (usertype === "resident" && !flatno) {
        return res.status(400).json({ error: "FlatNo is required for resident users" });
     }
    const existingUser = await User.findOne({ $or: [{email:email}, 
      {username:username}] });
    if (existingUser) {
        res.status(400)
        throw new Error(`${username} with${email} already exists`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        name,
        username,
        email,
        password:hashedPassword,
        flatno,
        usertype,
        contactno,
        role: usertype === "maintenance" ? role : undefined, 
        admin: (await User.countDocuments()) === 0,
      };
    const user = await User.create(userData);
    const msg = `Dear ${user.name}\n\nWelcome To Our Society.`
    sendNotification(user.email,"User registration",msg);
    if (user) {
      res.status(201).json({
        user,
        token: generateToken(user._id),
        redirectUrl:`/society/homepage`
      })
    }
  }catch(error) {
    console.error("Error in /registerPage:", error.message);
    res.status(400).json({ error: error.message,
        redirectUrl: '/society/register' });
};
  
};

// Function to log out the user
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    Blacklisted_tokens.add(token);
 
    return res.status(200).json({
      message: 'Logged out successfully',
      redirectUrl: '/society/login'
    });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    return res.status(500).json({
      error: "Failed to log out",
      details: error.message,
    });
  }
};


export const getUser = async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId).select('-password'); // Fetch user data except password
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({user});
  } catch (error) {
      return res.status(500).json({ message: 'Error retrieving user data: ' + error.message });
  }
};

export default Blacklisted_tokens;