import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6380',
});

// Set : mettre une valeur dans le cache avec une clé et un TTL optionnel ( - en secondes )
export async function set<T>(key: string, value: T, ttl?: number) {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    const stringifiedValue = JSON.stringify(value)
    await redisClient.set(key, stringifiedValue, {
        EX: ttl,
    });
}
// Get : récupérer une valeur du cache par sa clé
export async function get<T>(key: string) {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    const value = await redisClient.get(key);
    return value ? JSON.parse(value) as T : null;
}

// Del : supprimer une valeur du cache par sa clé
export async function del(key: string) {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    await redisClient.del(key);
}