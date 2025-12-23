import { useMemo, useState } from "react";
import Card from "./Card";

type Book = {
  title: string;
  pictureUrl: string;
  isbn: string;
};

const PAGE_SIZE = 8;
const MAX_CARDS = 16;

function generateMockBooks(count: number): Book[] {
  const coverBase = "https://covers.openlibrary.org/b/id";
  return Array.from({ length: count }).map((_, i) => {
    const id = 8000 + i;
    return {
      title: `Livre ${i + 1}`,
      pictureUrl: `${coverBase}/${id}-M.jpg`,
      isbn: String(2000000000 + i),
    };
  });
}

export default function Research() {
  const allBooks = useMemo(() => generateMockBooks(MAX_CARDS), []);
  const totalPages = Math.ceil(allBooks.length / PAGE_SIZE);

  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const visibleBooks = allBooks.slice(start, start + PAGE_SIZE);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#6B5B4C] mb-6">
        Votre résultat de recherche
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Nous avons trouvé {MAX_CARDS} cartes maximum avec {PAGE_SIZE} par page.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleBooks.map((b) => (
          <div key={b.isbn} className="flex justify-center">
            <Card title={b.title} pictureUrl={b.pictureUrl} isbn={b.isbn} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Préc
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => goTo(p)}
              className={`px-3 py-1 rounded ${p === page ? "bg-[#6C7A89] text-white" : "bg-gray-100"}`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Suiv
        </button>
      </div>
    </div>
  );
}