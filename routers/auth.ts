import { Router } from "express";
import { initialLoginSchema, loginSchema } from "../types";
import jwt from "jsonwebtoken";
import { checkReferralCode, debugValue, generateOTP, sendOTP } from "../utils";
import { db } from "../db/index";
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
            debugValue(otp, "Generated OTP");
        }
    
        res.status(200).json({
            message: "OTP sent to phone Number",
            success: true,
        });
    } catch (error) {
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
            res.status(411).json({
                message: "Invalid OTP",
                success: false,
            });
            return;
        }

        // valid OTP

        const user = await db.user.findFirst({
            where : { phoneNumber: phoneNumber }
        })

        if(user != null){
            const userId = user.id;
            const username = user.username;
            const rating = user.rating;
            const token = jwt.sign({userId, username, rating}, process.env.JWT_SECRET!); 
            res.status(200).json({
                token: token,
                success: true,
            });
            debugValue(user, "Existing User Login");
            return;
        }

        const isValidReferral = await checkReferralCode(data.referralCode || "");
        const referrer = await db.user.findFirst({
            where: { referralCode: data.referralCode }
        });
        
        if(isValidReferral && referrer) {
                await db.$transaction([
                    db.user.update({
                        where: { id: referrer.id },
                        data: { coins: { increment: 10 } }
                    }),
                    db.user.create({
                        data: {
                            phoneNumber: phoneNumber,
                            username: "User" + Math.floor(Math.random() * 10000),
                            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                            coins: 0,
                            referredById: referrer.id,
                        }
                    })
                ]);
                
                const newUser = await db.user.findFirst({
                    where: { phoneNumber: phoneNumber }
                });
                debugValue(newUser, "New User using Referral Code");
                if(newUser == null) {
                    res.status(500).json({
                        message: "Internal Server Error",
                        success: false,
                    });
                    return;
                }
                const userId  = newUser.id;
                const username = newUser.username;
                const rating = newUser.rating;
                const token = jwt.sign({userId, username, rating}, process.env.JWT_SECRET!);
                res.status(200).json({
                    token: token,
                    success: true,
                })
                return;
        }else {
            const user = await db.user.create({
                data: {
                    phoneNumber: phoneNumber,
                    username: "User" + Math.floor(Math.random() * 10000),
                    referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    coins: 0,
                }
            });
            debugValue(user, "New User without Referral Code");
            const userId = user.id;
            const username = user.username;
            const rating = user.rating;
            const token = jwt.sign({userId, username, rating}, process.env.JWT_SECRET!);
            res.status(200).json({
                token: token,
                success: true,
            });
            return;
        }
    } catch (error) {
        debugValue(error, "Internal Server Error @ /api/auth/login");
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});

export default router;