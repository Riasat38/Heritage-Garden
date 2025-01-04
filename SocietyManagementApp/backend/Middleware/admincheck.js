`use strict`

import User from "../Model/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; dotenv.config();

const ensureAdmin = async (req,res,next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      try{
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (req.user && req.user.admin) { 
          next();
        }else { 
          res.status(403).json({ message: 'Access denied: Admins only' }); 
        }
      }catch (error) { 
      console.error(error); 
      res.status(401).json({ message: 'Not authorized, token failed' }); 
      }
    } else { 
      res.status(401).json({ message: 'Not authorized, no token' }); 
    }
};


  
export default ensureAdmin;
  