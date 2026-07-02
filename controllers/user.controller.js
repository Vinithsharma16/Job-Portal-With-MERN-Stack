import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { log } from "node:console";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";



export const register = async (req, res) => {
    try {
        console.log("req.body:", req.body);
console.log("req.file:", req.file);

        const { fullname, email, phoneNumber, password, role } = req.body;
        console.log(fullname, email, phoneNumber, password, role);
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
       const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
  resource_type: "raw"
});


        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
            
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success:true
        });
    } catch (error) {
console.log(error);

    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        //check role is correct or not
        if(role !== user.role){
             return res.status(400).json({
                message:"Account doesn't exist with current role.",
                success:false
             })
        };

        const tokentdata = {
            userId:user._id
        }
        const token = await jwt.sign(tokentdata, process.env.SECRET_KEY,{expiresIn:'1d'});

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

       return res.status(200).cookie("token", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,        // ✅ CORRECT
    secure: false,         // for localhost
    sameSite: "lax"
}).json({
    message: `Welcome back ${user.fullname}`,
    user,
    success: true
});

    } catch (error) {
        console.log(error); 
    }
}
export const logout = async (req,res) => {
    try {
        return res.status(200).cookie("token", "" , {maxAge:0}).json({
            mesaage:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        let skillsArray = skills ? skills.split(",").map(s => s.trim()) : [];

        const user = await User.findById(req.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray.length) user.profile.skills = skillsArray;

        
        if (req.file) {
    const fileUri = getDataUri(req.file);

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
        folder: "resumes",
        access_mode: "public"
    });

    user.profile.resume = cloudResponse.secure_url;
    user.profile.resumeOriginalName = req.file.originalname;
}


        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
