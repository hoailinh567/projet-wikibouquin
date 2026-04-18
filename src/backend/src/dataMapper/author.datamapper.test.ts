import { describe, it, expect, vi, beforeEach } from "vitest";
import authorDataMapper from "./author.datamapper.ts";
import { get, set } from "../utils/redis.ts";
import openlibraryClient from "../client/openlibrary.ts";

// vi.mock() est automatiquement hissé avant les imports par Vitest.
// Cela remplace le module entier par une version factice AVANT que
// author.datamapper.ts l'importe
vi.mock("../utils/redis.ts", () => ({
    // vi.fn() crée une fonction factice que l'on peut contrôler dans chaque test
    get: vi.fn(),
    set: vi.fn(),
}));

vi.mock("../client/openlibrary.ts", () => ({
    // `default` car openlibrary.ts utilise export default
    default: {
        getAuthorByKey: vi.fn(),
    },
}));

// vi.mocked() sert uniquement à satisfaire TypeScript :
const mockGet = vi.mocked(get);
const mockSet = vi.mocked(set);
const mockGetAuthorByKey = vi.mocked(openlibraryClient.getAuthorByKey);

describe("authorDataMapper.getAuthorByKey", () => {

    // beforeEach s'exécute avant chaque test.
    // vi.clearAllMocks() remet à zéro les appels enregistrés sur tous les mocks,
    // pour éviter qu'un test pollue le suivant.
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retourne l'auteur depuis Redis si le cache contient la donnée (cache hit)", async () => {
        const cachedAuthor = { name: "Victor Hugo" };

        // mockResolvedValue : définit ce que la fonction mock retourne (Promise résolue)
        mockGet.mockResolvedValue(cachedAuthor);

        const result = await authorDataMapper.getAuthorByKey("OL123A");

        expect(result).toEqual({ name: "Victor Hugo" });

        // Vérifie que get() a bien été appelé avec la bonne clé
        expect(mockGet).toHaveBeenCalledWith("author:OL123A");

        // L'API ne doit PAS être contactée si Redis a répondu
        expect(mockGetAuthorByKey).not.toHaveBeenCalled();
    });

    it("appelle l'API et stocke le résultat dans Redis si le cache est vide (cache miss)", async () => {
        // null = cache vide
        mockGet.mockResolvedValue(null);
        mockGetAuthorByKey.mockResolvedValue({ name: "Albert Camus" });

        const result = await authorDataMapper.getAuthorByKey("OL456A");

        expect(result).toEqual({ name: "Albert Camus" });

        // Vérifie que set() a bien été appelé pour mettre en cache, avec le bon TTL
        expect(mockSet).toHaveBeenCalledWith(
            "author:OL456A",
            { name: "Albert Camus" },
            2629800
        );
    });

    it("retourne 'Auteur inconnu' si l'API renvoie un objet sans champ name", async () => {
        mockGet.mockResolvedValue(null);
        mockGetAuthorByKey.mockResolvedValue({}); // pas de champ name

        const result = await authorDataMapper.getAuthorByKey("OL789A");

        expect(result).toEqual({ name: "Auteur inconnu" });
    });

    it("propage l'erreur si l'API échoue", async () => {
        mockGet.mockResolvedValue(null);

        // mockRejectedValue : simule une Promise qui rejette (équivalent d'un throw async)
        mockGetAuthorByKey.mockRejectedValue(new Error("API indisponible"));

        // rejects.toThrow() vérifie qu'une Promise rejette avec ce message d'erreur
        await expect(
            authorDataMapper.getAuthorByKey("OL999A")
        ).rejects.toThrow("API indisponible");
    });
});