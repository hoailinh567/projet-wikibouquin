/**
 * Fonction wrapper pour fetch qui gère automatiquement le refresh du token
 * Si une requête échoue avec 401, elle tente de rafraîchir le token et réessaye
 */
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
      const refreshResponse = await fetch("http://localhost:3000/api/refresh", {
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
