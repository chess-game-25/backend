import {Router} from "express";
import { db } from "../db";
import { authMiddleware } from "../auth-middleware";
import { GameStatus } from "../generated/prisma"
import { WHITE_PLAYER } from "../types";

const router = Router();

router.post("/create", authMiddleware, async (req, res) => {
    try{
        const {userId} = req;
        const {playerColor} = req.body || WHITE_PLAYER;
        let whitePlayerId, blackPlayerId;
        if(playerColor == WHITE_PLAYER) {
            whitePlayerId = userId;
        } else {
            blackPlayerId = userId;
        }
        const game = await db.game.create({
            data:{
                whitePlayer: {
                connect: {
                    id: whitePlayerId ?? '',
                },
                },
                blackPlayer: {
                connect: {
                    id: blackPlayerId ?? '',
                },
                },
                status: GameStatus.IN_PROGRESS,
            }
        });

        res.status(200).json({
            roomId: game.id,
            success: true,
        })
    }catch(err){
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});

export default router;