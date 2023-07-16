import express from "express"

import User from "../models/User.js";
const router = express.Router();

// update user
router.put("/:id", async(req,res)=>{
    const { userId} = req.body;
    if(userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
            await user.save()
            res.status(200).json("user");
        }catch(err){
            return res.status(500).json({ message: 'Something went wrong' });
        }
    } else{
        return res.status(403).json("You can only update your account")
    }
})

// delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully");
        }catch(err){
            return res.status(500).json(err);
        }
    } else{
        return res.status(403).json("You can only Delete your account")
    }
})
// get a user

router.get("/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,email,phoneNumber, ...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json("Internal server error")
    }
})

export default router;