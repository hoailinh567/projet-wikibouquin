import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";

type Book = {
  title: string;
  author: string;
  cover: string;
  isbn: string;
  is_visible: boolean;
};

function EditMyCollection() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchMyCollection = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/api/edit-my-collection`
      );
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/signin");
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Fetched collection data:", data);
      setBooks(data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/signin");
      } else {
        fetchMyCollection();
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  const toggleVisibility = async (clickedBookIsbn: string) => {
    const book = books.find((b) => b.isbn === clickedBookIsbn);
    if (!book) return;

    const newVisibility = !book.is_visible;
    const collectionId = user?.collection_ids[0];
    try {
      // Appel API pour changer la visibilité
      const response = await fetchWithAuth(`http://localhost:3000/api/edit-my-collection/update-visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbn: clickedBookIsbn,
          collection_id: collectionId,
          is_visible: newVisibility,
        }),

      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        console.error("toggleVisibility API failed:", response.status, text);
        throw new Error(`Erreur API: ${response.status}`);
      }

      // si le backend renvoie l'objet mis à jour, utilise-le ; sinon applique le toggle local
      const data = await response.json().catch(() => null);

      setBooks((currentBooks) =>
        currentBooks.map((b) =>
          b.isbn === clickedBookIsbn
            ? { ...b, is_visible: data?.is_visible ?? data?.is_visible ?? newVisibility }
            : b
        )
      );

    } catch (err) {
      console.error("Erreur toggleVisibility:", err);
      alert("Impossible de changer la visibilité pour le moment.");
    }
  };

  // Fonction de suppression d'un livre
  const deleteBook = async (clickedBookIsbn: string) => {
    if (!confirm("Confirmer la supression")) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/api/edit-my-collection/delete`,
        {
          method: "DELETE",
          body: JSON.stringify({
            isbn: clickedBookIsbn,
            collection_id: user?.collection_ids[0],
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      // Mise à jour locale après succès
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.isbn !== clickedBookIsbn)
      );
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("La suppression a échoué.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 grid h-full place-items-center text-center min-h-[400px]">
        <div>
          <img
            src="/error.jpg"
            alt="Erreur"
            className="mx-auto w-48 h-48 md:w-64 md:h-64 object-contain mb-4"
          />
          <p className="text-xl font-semibold text-red-500">
            Impossible de charger votre collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair-sc text-[#6B5B4C] mb-6 md:mb-8 text-center">
        Ma Collection
      </h1>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg md:text-xl text-gray-600">
            Vous n'avez pas encore de livres dans votre collection.
          </p>
        </div>
      ) : (
        <>
          {/* Version Desktop*/}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-[#6B5B4C] text-white">
                <tr>
                  <th className="p-3 md:p-4 text-left text-sm md:text-base">
                    Image
                  </th>
                  <th className="p-3 md:p-4 text-left text-sm md:text-base">
                    Titre
                  </th>
                  <th className="p-3 md:p-4 text-left text-sm md:text-base">
                    Auteur
                  </th>
                  <th className="p-3 md:p-4 text-center text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr
                    key={book.isbn}
                    className={`${index % 2 === 0 ? "bg-[#f5f0eb]" : "bg-white"
                      } border-b border-gray-200 hover:bg-gray-100 transition`}
                  >
                    <td className="p-3 md:p-4">
                      <Link to={`/book/${book.isbn}`}>
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-20 md:w-20 md:h-28 object-cover rounded shadow"
                        />
                      </Link>
                    </td>
                    <td className="p-3 md:p-4 font-semibold text-sm md:text-base">
                      {book.title}
                    </td>
                    <td className="p-3 md:p-4 text-gray-600 text-sm md:text-base">
                      {book.author}
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm text-gray-600">
                            {book.is_visible ? "Public" : "Privé"}
                          </span>
                          <button
                            onClick={() => toggleVisibility(book.isbn)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C7A89] ${book.is_visible ? "bg-[#6C7A89]" : "bg-gray-300"
                              }`}
                            aria-label="Toggle visibility"
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${book.is_visible
                                ? "translate-x-6"
                                : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>

                        <button
                          onClick={() => deleteBook(book.isbn)}
                          className="bg-red-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-red-600 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Mobile */}
          <div className="md:hidden space-y-4">
            {books.map((book) => (
              <div
                key={book.isbn}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex gap-4 mb-4">
                  <Link to={`/book/${book.isbn}`}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded shadow shrink-0"
                  />
                  </Link>
                  <div className="grow">
                    <h3 className="font-bold text-base mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Visibilité</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">
                        {book.is_visible ? "Public" : "Privé"}
                      </span>
                      <button
                        onClick={() => toggleVisibility(book.isbn)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${book.is_visible ? "bg-[#6C7A89]" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${book.is_visible ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBook(book.isbn)}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default EditMyCollection;
