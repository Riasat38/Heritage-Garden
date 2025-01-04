`use strict`
import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Blacklisted_tokens from "../Controller/controller.js";
dotenv.config();

const authorizedUser = async (req,res,next) =>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            if (Blacklisted_tokens.has(token)) { 
                return res.status(401).json({ message: 'Token is blacklisted, please log in again',
                    redirectUrl: '/society/login' });
                };
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error){
            console.error(error);
            res.status(401).redirect('/society/login');
            throw new Error('Not Authorized, Token Failed');
        }
    }
}
export default authorizedUser;