import openlibraryClient from "../client/openlibrary";
import { get, set } from "../redis";

type Work = {
    description: string;
}

const workDataMapper = {
    async getWorkByKey(key: string): Promise<Work> {
        const workFromCache = await get<Work>(`work:${key}`);

        if (workFromCache) {
            return workFromCache;
        }

        const rawWork = await openlibraryClient.getWorkByKey(key);

        const work: Work = {
            description: rawWork.description.value || "Aucune description disponible"
        };

        // Stockage description du work dans le cache Redis avec un TTL de 1 mois
        set<Work>(`work:${key}`, work, 2629800);

        return work;
    }
};
export default workDataMapper;