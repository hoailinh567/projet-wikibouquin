import { z } from "zod";

const addOrDeleteBookRequest = z.object({
    isbn: z
        .string()
        .trim()
        .regex(/^\d{9}[0-9Xx]$/, "L'ISBN doit être un ISBN-10 valide"),
    collection_id: z.number()
});

export { addOrDeleteBookRequest };