import { useCallback, useEffect, useState } from "react";
import CollectionButton from "./CollectionButton";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";

function BookDetails() {
  // recupérer l'isbn dans l'URL
  let { isbn } = useParams();

  type Book = {
    title: string;
    authors: string[];
    publish_date: string;
    isbn: string;
    number_of_pages: number;
    cover: string;
    description: string;
  };

  const [data, setData] = useState<Book>({} as Book);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Boolean>(false);
  const [hasBook, setHasBook] = useState<boolean>(false);

  // Function to fetch book details from the API, definition of the function BUT NOT LAUNCHING IT
  const fetchBookDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/book/${isbn}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setData(await response.json());
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  }, [isbn]);

  // Function pour vérifier qu'on a le livre ou pas
  const checkUserHasBook = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/has-book/${isbn}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setHasBook(result);
    } catch (error) {
      console.error("Error checking if user has book:", error);
      return false;
    }
  }, [isbn]);

  useEffect(() => {
    // Fetch book details using the ISBN from Props
    fetchBookDetails();
    checkUserHasBook();
  }, [checkUserHasBook, fetchBookDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 grid h-full place-items-center text-center">
        <div>
          <img
            src="/public/error.jpg"
            alt="Erreur de requête"
            className="mx-auto w-70 h-70 object-contain mb-4"
          />
          <p className="text-xl font-semibold text-red-500">
            Un problème est survenu - essayez plus tard !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grow max-w-6xl mx-auto p-5 mt-8 font-playfair">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
          <img
            src={data.cover}
            alt="Titre du livre"
            className="w-full md:w-full h-auto rounded-lg object-cover"
          />
          <CollectionButton hasBook={hasBook} setHasBook={setHasBook} isbn={isbn} />
        </div>

        <div className="flex flex-col text-right gap-2 w-full">
          <h3 className="text-2xl font-bold md:text-3xl mb-2">{data.title}</h3>
          <p className="text-base">
            <span className="font-bold">
              {data.authors.length === 1 ? "Auteur" : "Auteurs"} :{" "}
            </span>
            {data.authors.join(", ")}
          </p>
          <p className="text-base">
            <span className="font-bold">Date de publication :</span>{" "}
            {data.publish_date}
          </p>
          <p className="text-base">
            <span className="font-bold">Nombre de pages :</span>{" "}
            {data.number_of_pages === 0 ? "Inconnu" : data.number_of_pages}
          </p>
          <p className="text-base">
            <span className="font-bold">ISBN :</span>{" "}
            {data.isbn}
          </p>

          <p className="text-base">
            <span className="font-bold">Description : </span>
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
