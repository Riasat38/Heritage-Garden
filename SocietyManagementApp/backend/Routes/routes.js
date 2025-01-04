`use strict`;
//this file handles log in and signup related routes 
import express from "express";
import {getUser,loginUser,registerUser, logoutUser} from "../Controller/controller.js";
import { getRecruitment } from "../Controller/adminController.js";
import { getALLrents } from "../Controller/misc.js";

import authorizedUser from '../Middleware/protect.js';
const router = express.Router();

//initial Welcome page
router.get("/" , getRecruitment, getALLrents);

router.get("/about", (req,res) =>{
    res.json("This Is About Page");
});


router.get('/getUser', authorizedUser,getUser);
router.post("/login",loginUser);
     
router.post("/logout", logoutUser);

//Processing register formm and creating an user
router.post("/registerPage", registerUser); 

export default router; 