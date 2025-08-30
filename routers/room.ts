import {Router} from "express";
import { db } from "../db";
import { authMiddleware } from "../auth-middleware";
import { GameStatus } from "../generated/prisma"
import { debugValue } from "../utils";

const router = Router();

router.post("/create", authMiddleware, async (req, res) => {
    // TODO: User cant create multiple games 
    try{
    const {userId} = req;
        const game = await db.game.create({
            data:{
            whitePlayerId: userId,
            blackPlayerId: null,
            status: GameStatus.IN_PROGRESS,
        }})
        res.status(200).json({
            roomId: game.id,
            success: true,
        })
    }catch(err){
        debugValue(err, "Internal Server Error @ /api/room/create")
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

export default router;