import { describe, it, expect } from "vitest";
import { isValidIsbn } from "./book.validator.ts";

describe("on va tester isValidIsbn", () => {
    it("should be valid with 10 numbers", () => {
        const result = isValidIsbn.safeParse({ isbn: "2070360024" });
        expect(result.success).toBe(true);
    });

    it("should be valid with 9 numbers and caps letter X", () => {
        const result = isValidIsbn.safeParse({ isbn: "207036002X" });
        expect(result.success).toBe(true);
    });

    it("should be valid with 9 numbers and min letter x", () => {
        const result = isValidIsbn.safeParse({ isbn: "207016002x" });
        expect(result.success).toBe(true);
    });

    it("should be invalid less than 10 numbers", () => {
        const result = isValidIsbn.safeParse({ isbn: "123456789" });
        expect(result.success).toBe(false);
    });

    it("should be invalid more than 10 numbers", () => {
        const result = isValidIsbn.safeParse({ isbn: "123456789765" });
        expect(result.success).toBe(false);
    });

    it("should be invalid with another letter than X", () => {
        const result = isValidIsbn.safeParse({ isbn: "207036002M" });
        expect(result.success).toBe(false);
    });

    it("should be invalid with any another letter min", () => {
        const result = isValidIsbn.safeParse({ isbn: "207036002a" });
        expect(result.success).toBe(false);
    });
});