import { z } from "zod";

const addOrDeleteBookRequest = z.object({
    isbn: z
        .string()
        .trim()
        .regex(/^(?:\d{9}[\dXx]|\d{13})$/, "L'ISBN doit être un ISBN-10 ou ISBN-13 valide"),
    collection_id: z.number()
});

export { addOrDeleteBookRequest };