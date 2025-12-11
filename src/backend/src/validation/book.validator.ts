import { z } from "zod";

const isValidIsbn = z.object({
  isbn: z
    .string()
    .trim()
    .regex(/^\d{9}[0-9Xx]$/, "L'ISBN doit être un ISBN-10 valide"),
});

export { isValidIsbn };