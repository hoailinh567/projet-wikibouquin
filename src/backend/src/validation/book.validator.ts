import { z } from "zod";

// ✅ Schéma de validation Zod
const isValidIsbn = z.object({
  isbn: z
    .string()
    .trim()
    .regex(/^\d{10}(\d{3})?$/, "L'ISBN doit contenir 10 ou 13 chiffres"),
});

export { isValidIsbn };