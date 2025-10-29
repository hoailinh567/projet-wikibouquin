const openlibraryClient = {
  async getBookByIsbn(isbn: string) {
    const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
      headers: { "User-Agent": "Wikibouquin/1.0 (hoai-linh.nguyen@oclock.school)" },
    });
    if (!response.ok) {
      throw new Error(`Livre non trouvé pour l'ISBN: ${isbn}`);
    }
    const data = await response.json();
    return data;
  },

  async getAuthorByKey(authorKey: string) {
    const response = await fetch(`https://openlibrary.org/author/${authorKey}.json`, {
      headers: { "User-Agent": "Wikibouquin/1.0 (hoai-linh.nguyen@oclock.school)" },
    });
    if (!response.ok) {
      throw new Error(`Auteur non trouvé pour la clé: ${authorKey}`);
    }
    const data = await response.json();
    return data;
  },

  async getWorkByKey(workKey: string) {
    const response = await fetch(`https://openlibrary.org/works/${workKey}.json`, {
      headers: { "User-Agent": "Wikibouquin/1.0 (hoai-linh.nguyen@oclock.school)" },
    });
    if (!response.ok) {
      throw new Error(`Work non trouvée pour la clé: ${workKey}`);
    }
    const data = await response.json();
    return data;
  },
};

export default openlibraryClient;