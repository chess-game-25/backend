import { Router } from "express"
import { checkReferralSchema } from "../types";
import { checkReferralCode } from "../utils";
const router = Router();

router.post('/check_referral', async(req, res) => {

    try {
        const { success, data } = checkReferralSchema.safeParse(req.body);
        if(!success){
            res.status(411).json({
                message: "Invalid Referral code",
                success: false,
            });
            return;
        }
        const { referralCode } = data;

        const exists = await checkReferralCode(referralCode);

        if(!exists) {
            res.status(404).json({
                message: "Referral Code Not Found",
                success: false,
            });
            return;
        }

        res.status(200).json({
            message: "Valid Referral Code",
            success: true,
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
export default router;