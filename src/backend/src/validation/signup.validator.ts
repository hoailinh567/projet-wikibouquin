import { z } from "zod";

export const isValidSignup = z.object({
    username: z.string().trim().min(5).max(25),
    email: z.email().trim(),
    password: z.string().min(6),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export type SignupData = z.infer<typeof isValidSignup>;