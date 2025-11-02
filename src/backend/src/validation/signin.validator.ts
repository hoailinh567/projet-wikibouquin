import { z } from "zod";

export const isValidSignin = z.object({
    email: z.email().trim(),
    password: z.string()
});

export type SigninData = z.infer<typeof isValidSignin>;