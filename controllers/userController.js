import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret);

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const signup = async (req, res) => {
  console.log(req.body)
  let { email,username, phoneNumber, password, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ 
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
        username: req.body.username, 
        name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

// export const getAllUsers = async () => {
//     return await User.find({});
//   };
  
//   export const getOneUser = async (id) => {
//     let user = await User.findById(id);
//     let res = user.toObject();
//     delete res.password;
//     return res;
//   };
  
//   export const addUser = async (user) => {
//     return await User.create(user);
//   };
  
//   export const updateUser = async (user) => {
//     let res;
//     //check if the user is updating the profile or the password
//     if (user.password) {
//       const foundUser = await User.findById(user._id);
//       //check if the old password matches the one in the db
//       if (!foundUser.validPassword(user.oldPassword)) {
//         throw new Error("Incorrect old password");
//       }
//       //encrypt the password
//       foundUser.password = foundUser.encryptPassword(user.password);
//       res = await User.findByIdAndUpdate(user._id, foundUser);
//     } else {
//       res = await User.findByIdAndUpdate(user._id, user);
//     }
//     return res;
//   };
  
//   export const deleteUser = async (id) => {
//     return await User.findOneAndRemove({ _id: id });
//   };
  