`use strict`;

import dotenv from 'dotenv';
import cors from 'cors';
import express from "express";
import path from "path";

//routes
import routes from "./Routes/routes.js";
import homeRoutes from "./Routes/homePageRoutes.js";
import adminRouter from "./Routes/adminRoutes.js";
//middlewares
import ensureAdmin from './Middleware/admincheck.js';
import authorizedUser from './Middleware/protect.js';
//config
import { fileURLToPath } from 'url';
import session from 'express-session';
import connectDB from "./config/db.js";

connectDB();
dotenv.config()

const port =  process.env.PORT || 4069;
const app = express();

//middleware to check HTTP request type and origin
app.use((req, res, next) => {
  console.log('Incoming request to:', req.path);
  console.log('Request method:', req.method);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(cors({ 
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',  
  allowedHeaders: 'Content-Type,Authorization'  
}));

app.use(session({
    secret: 'your-secret-key',  // Set a secret key for session encryption
    resave: false,              // Do not resave session if it's not modified
    saveUninitialized: true,    // Save an uninitialized session
    cookie: { secure: false }   // Set `secure: true` in production if using HTTPS
  }));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//routes

app.use("/society",routes); //initial and handlinng login

app.use("/society/homepage",authorizedUser, homeRoutes);
app.use("/society/adminPanel",authorizedUser, ensureAdmin, adminRouter);


app.listen(port,() => {
    console.log("Server Entry Point")
    console.log(`server is running on ${port}`);
});

