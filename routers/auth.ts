import { Router } from "express";
import { initialLoginSchema, loginSchema } from "../types";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP } from "../utils";
const router = Router();

router.post("/initiate_login", async (req, res) => {
    try {
        const {success, data} = initialLoginSchema.safeParse(req.body);
        if(!success) {
            res.status(411).json({
                message : "Invalid Inputs",
                success : false,
            });
            return;
        }
    
        const {phoneNumber} = data;
        const otp = generateOTP(phoneNumber);
    
        if(process.env.NODE_ENV !== "development") {
            await sendOTP(phoneNumber, otp);
        } else {
            console.log(otp);
        }
    
        res.status(200).json({
            message: "OTP sent to phone Number",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {success, data} = loginSchema.safeParse(req.body);
        if(!success) {
            res.status(411).json({
                message: "Invalid Input",
                success:false,
            });
            return;
        }

        const {phoneNumber, otp} = data;
        const generatedOTP = generateOTP(phoneNumber);
        if(otp !== generatedOTP){
            console.log(otp, generatedOTP);
            res.status(411).json({
                message: "Invalid OTP",
                success: false,
            });
            return;
        }
        
        const userId = "demo"
        const token = jwt.sign(userId, process.env.JWT_SECRET!); 
        res.status(200).json({
            token: token,
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});

export default router;