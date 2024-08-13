const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const getToken = (user) => {
    const token = jwt.sign(
        {userId:user._id,emailId:user.email,isAdmin:user.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    return token;
}

const signup = async (req, res) => {
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(403).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        user = await User.create(req.body);
        return res.status(200).json({"token":getToken(user)});
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
const login = async (req, res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        return res.status(200).json({"token":getToken(user)});
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}


module.exports = {
    signup,
    login,
}