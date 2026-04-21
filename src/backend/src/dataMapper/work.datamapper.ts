import openlibraryClient from "../client/openlibrary.ts";
import { get, set } from "../utils/redis.ts";

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

        let description = "Aucune description disponible";

        if (rawWork.description && rawWork.description.value) {
            description = rawWork.description.value
        }

        const work: Work = {
            description: description
        };

        // Stockage description du work dans le cache Redis avec un TTL de 1 mois
        await set<Work>(`work:${key}`, work, 2629800);

        return work;
    }
};
export default workDataMapper;