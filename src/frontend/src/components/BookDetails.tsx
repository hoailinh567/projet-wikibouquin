import { useCallback, useEffect, useState } from "react";
import CollectionButton from "./CollectionButton";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useFetch } from "../hooks/useFetch";
import Spinner from "./Spinner";
import NotFound from "./Errors/NotFound";
import BadRequest from "./Errors/BadRequest";
import ServerError from "./Errors/ServerError";

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

  const { data, loading, error, execute } = useFetch<Book>();
  const [hasBook, setHasBook] = useState<boolean>(false);

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
    execute(`http://localhost:3000/api/book/${isbn}`);

    // Check if the current logged in user has the book in their collection
    checkUserHasBook();
  }, [checkUserHasBook, execute, isbn]);

  if (loading) return <Spinner />;
  if (error?.status === 404) return <NotFound />;
  if (error?.status === 400) return <BadRequest message={`ISBN <${isbn}> invalide`} />;
  if (error || !data) return <ServerError />;


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
