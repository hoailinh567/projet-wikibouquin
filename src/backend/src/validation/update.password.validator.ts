import { z } from "zod";

export const isValidUpdatePassword = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Le nouveau mot de passe doit être différent de l'ancien",
  path: ["newPassword"],
})

export type UpdatePasswordData = z.infer<typeof isValidUpdatePassword>;
