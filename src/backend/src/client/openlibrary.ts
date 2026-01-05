type SearchParams = {
  q: string;
  limit?: number;
  offset?: number;
};

type SearchResult = {
  numFound: number;
  start: number;
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    cover_i?: number;
  }>;
};

const openlibraryClient = {
  async search(params: SearchParams): Promise<SearchResult> {
    const searchParams = new URLSearchParams({
      q: params.q,
      limit: String(params.limit || 20),
      offset: String(params.offset || 0),
      fields: "key,title,author_name,first_publish_year,isbn,cover_i",
      lang: "fre",
    });

    const response = await fetch(
      `https://openlibrary.org/search.json?${searchParams}`,
      {
        headers: { "User-Agent": "Wikibouquin/1.0 (hoai-linh.nguyen@oclock.school)" },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche: ${response.status}`);
    }

    const data = await response.json();
    return {
      numFound: data.numFound,
      start: data.start,
      docs: data.docs,
    };
  },

  async getBookByIsbn(isbn: string) {
    const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
      headers: { "User-Agent": "Wikibouquin/1.0 (hoai-linh.nguyen@oclock.school)" },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw { response }; // Pour gérer le 404 dans le contrôleur
      }

      throw new Error(`Erreur lors de la récupération du livre avec l'ISBN: ${isbn}`);
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