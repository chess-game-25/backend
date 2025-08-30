import {Router} from "express";
import { db } from "../db";
import { authMiddleware } from "../auth-middleware";
import { GameStatus } from "../generated/prisma"
import { debugValue } from "../utils";

const router = Router();

router.post("/create", authMiddleware, async (req, res) => {
    try{
    const {userId} = req;
        const currGames = await db.game.count({
            where:{
                OR:[
                    {
                        whitePlayerId: userId,
                        status: GameStatus.IN_PROGRESS
                    },
                    {
                        blackPlayerId: userId,
                        status: GameStatus.IN_PROGRESS 
                    },
                    {
                        whitePlayerId: userId,
                        status: GameStatus.WAITING_FOR_PLAYERS
                    },
                ]
            }
        })
        if(currGames > 0){
            res.status(409).json({
                message: "User already has an active game",
                success: false
            })
            return;
        }
        const game = await db.game.create({
            data:{
            whitePlayerId: userId,
            blackPlayerId: null,
            status: GameStatus.WAITING_FOR_PLAYERS,
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