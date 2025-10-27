import { z } from "zod";

// ✅ Schéma de validation Zod
const isValidIsbn = z.object({
  isbn: z
    .string()
    .trim()
    .regex(/^(?:\d{9}[\dXx]|\d{13})$/, "L'ISBN doit être un ISBN-10 ou ISBN-13 valide"),
});

export { isValidIsbn };