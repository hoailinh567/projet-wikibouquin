import { API_URL } from './api';

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ajouter credentials pour inclure les cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  // Première tentative
  let response = await fetch(url, fetchOptions);

  // Si la réponse est 401 (Unauthorized), tenter de rafraîchir le token
  if (response.status === 401) {
    try {
      // Appeler l'endpoint de refresh
      const refreshResponse = await fetch(`${API_URL}/api/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // Le refresh a réussi, réessayer la requête originale
        response = await fetch(url, fetchOptions);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
    }
  }

  return response;
}
