import express, { request } from "express";
import bcrypt from "bcrypt";

import upload from "../utils/multer.js";

import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
const JWTSEC = "#2@!@$ndja45883 r7##";
import crypto from "crypto";

import User from "../models/User.js";

import { signin, signup } from "../controllers/userController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/gsignin", signin);
router.post("/signup", signup);
router.post("/gsignup", signup);
//Register

router.post("/register",
body('email').isEmail(),
body('password').isLength({ min: 6 }) ,
body('username').isLength({ min: 3 }) ,
body('phoneNumber').isLength({ min: 10}) ,
async (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json("some error occured")
        }
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(200).json("You already have an account")
    };
    try{
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // create new user
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            password: hashedPassword,
            username: req.body.username
        });
        // save user
        const accessToken = jwt.sign({
            id:user._id,
            username:user.username
        }, JWTSEC);
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
})

//Login
router.post("/login", 
    body('email').isEmail(),
    body('password').isLength({ min: 6 }) ,
    async (req, res) =>{
    try {
        const user = await User.findOne({ email: req.body.email});
        if(!user){
            return res.status(400).json("User not found")  
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword){
            return res.status(400).json("wrong password")
        } 
        const accessToken = jwt.sign({
            id:user._id,
            username:user.username
        }, JWTSEC,
        { expiresIn: "1h" });
        const {password , ...other} = user._doc
        res.status(200).json({other , accessToken});
    } catch (err) {
        res.status(500).json("Internal error occured");
    }

})

export default router;