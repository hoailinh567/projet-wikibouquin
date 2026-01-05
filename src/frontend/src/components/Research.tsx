import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "./Card";
import Spinner from "./Spinner";

type Book = {
  title: string;
  authors: string[];
  publishYear: number | null;
  isbn: string | null;
  cover: string | null;
};

type SearchResponse = {
  numFound: number;
  offset: number;
  books: Book[];
};

const PAGE_SIZE = 20;

export default function Research() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const currentOffset = parseInt(searchParams.get("offset") || "0", 10);

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/api/search?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&offset=${currentOffset}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la recherche");
        }
        const result: SearchResponse = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentOffset]);

  const totalPages = data ? Math.ceil(data.numFound / PAGE_SIZE) : 0;
  const currentPage = Math.floor(currentOffset / PAGE_SIZE) + 1;

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * PAGE_SIZE;
    setSearchParams({ q: query, offset: String(newOffset) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display (show max 5 pages around current)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (!query) {
    return (
      <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#6B5B4C] mb-6">
          Recherche
        </h1>
        <p className="text-center text-gray-600">
          Utilisez la barre de recherche pour trouver des livres.
        </p>
      </div>
    );
  }

  return (
    <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#6B5B4C] mb-6">
        Résultats pour "{query}"
      </h1>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {error && (
        <p className="text-center text-red-600 mb-6">{error}</p>
      )}

      {!loading && data && (
        <>
          <p className="text-center text-gray-600 mb-6">
            {data.numFound} résultat{data.numFound > 1 ? "s" : ""} trouvé{data.numFound > 1 ? "s" : ""}
          </p>

          {data.books.length === 0 ? (
            <p className="text-center text-gray-500">Aucun livre trouvé pour cette recherche.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.books.map((book, index) => (
                  <div key={book.isbn || `book-${index}`} className="flex justify-center">
                    {book.isbn ? (
                      <Card
                        title={book.title}
                        pictureUrl={book.cover || "/placeholder-book.jpg"}
                        isbn={book.isbn}
                      />
                    ) : (
                      <div className="w-full max-w-[280px] h-96 bg-[#f5f0eb] text-center border border-gray-300 rounded-lg shadow-md p-4">
                        <img
                          className="rounded-t-lg mx-auto object-contain h-48 w-full opacity-50"
                          src={book.cover || "/placeholder-book.jpg"}
                          alt={book.title}
                        />
                        <div className="p-3 md:p-5">
                          <p className="line-clamp-2 text-base md:text-lg font-bold mb-3 md:mb-5">{book.title}</p>
                          <p className="text-sm text-gray-500">ISBN non disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Préc
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded ${page === currentPage ? "bg-[#6C7A89] text-white" : "bg-gray-100"}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Suiv
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
