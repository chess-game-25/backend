import { z } from "zod";

export const initialLoginSchema = z.object({
  phoneNumber: z.string().min(10).max(10),
});

export const loginSchema = z.object({
  phoneNumber: z.string().min(10).max(10),
  otp: z.string().min(6).max(6),
});

export type InitialLoginSchema = z.infer<typeof initialLoginSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;