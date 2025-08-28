import { TOTP } from "totp-generator";
import twilio from "twilio";
import base32 from 'hi-base32'

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
const OTP_VALIDITY_TIME = 60 * 5; // 5 minutes

export const generateOTP = (userPhoneNumber: string) => {

  const token= base32.encode(userPhoneNumber + process.env.JWT_SECRET!);
  const { otp } = TOTP.generate(token, {period : OTP_VALIDITY_TIME});
  return otp;
};

export const sendOTP = async(userPhoneNumber: string, otp: string) => {
    const message = await twilioClient.messages.create({
        body: `Your OTP to login to ${process.env.APP_NAME} is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        // Only indian Phone numbers
        to: `+91${userPhoneNumber}`,
    });
    console.log(message);
};