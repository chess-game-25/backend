import { TOTP } from "totp-generator";
import twilio from "twilio";
import base32 from 'hi-base32'
import { db } from "./db";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const OTP_VALIDITY_TIME = 60 * 5; // 5 minutes

export const generateOTP = (userPhoneNumber: string) => {

  const totpKey = base32.encode(userPhoneNumber + process.env.JWT_SECRET!);
  const { otp } = TOTP.generate(totpKey, {period : OTP_VALIDITY_TIME});
  return otp;
};

export const sendOTP = async(userPhoneNumber: string, otp: string) => {
    const message = await twilioClient.messages.create({
        body: `Your OTP to login to ${process.env.APP_NAME} is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        // Only indian Phone numbers
        to: `+91${userPhoneNumber}`,
    });
    debugValue(message, "Twilio Message");
};

export const checkReferralCode = async (referralCode: string) => {
  const user = await db.user.findFirst({
    where:{
      referralCode: referralCode
    }
  })
  if(user !== null) return true;
  return false;
}

export const debugValue = (value: any, label: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`${label}:`, value);
  }
};
