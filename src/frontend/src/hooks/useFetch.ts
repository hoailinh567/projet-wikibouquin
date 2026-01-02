// hooks/useFetch.ts
import { useState, useCallback } from "react";

export class HttpError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message || `HTTP ${status}`);
        this.status = status; // Store the status
        this.name = 'HttpError'; // Optional: set the error name
    }
}

export function useFetch<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<HttpError | null>(null);

    const execute = useCallback(async (url: string, options?: RequestInit) => {
        setLoading(true);
        setError(null); // supprimer les erreurs précédentes
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new HttpError(response.status);
            }
            const result = await response.json();
            setData(result);
            return result;
        } catch (e) {
            const err = e instanceof HttpError ? e : new HttpError(500);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, execute };
}