import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const authToken = req.headers.authorization?.split(" ")[1];
    if(!authToken){
        res.status(411).json({
            message: "Auth token is invalid",
            success: false
        })
        return;
    }
    try{
        // TODO: Add Rating to JWT
        const data = jwt.verify(authToken, process.env.JWT_SECRET!);
        req.userId = (data as unknown as JwtPayload).userId as string;
        req.username = (data as unknown as JwtPayload).username as string;

        next();
    }catch(err){
        res.status(411).json({
            message: "Auth token is invalid",
            success: false
        });
        return;
    }
   
}