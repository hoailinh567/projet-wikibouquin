import { useEffect, useState } from "react";
import CollectionButton from "./collection_button";

function BookDetails(Props: { isbn: string | undefined }) {
  type Book = {
    title: string;
    authors: string[];
    publish_date: string;
    isbn_10: string[];
    isbn_13: string[];
    number_of_pages: number;
    cover: string;
  };

  const [data, setData] = useState<Book>({} as Book);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<String | null>(null);

  // Function to fetch book details from the API, definition of the function BUT NOT LAUNCHING IT
  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/book/${Props.isbn}`
      );
      setData(await response.json());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Un problème est survenu"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch book details using the ISBN from Props
    fetchBookDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
          <CollectionButton />
        </div>

        <div className="flex flex-col text-right gap-2 w-full">
          <h3 className="text-2xl font-bold md:text-3xl mb-2">{data.title}</h3>
          <p className="text-base">
            <span>Auteur :</span> Nom de l'auteur
          </p>
          <p className="text-base">
            <span>Date de création :</span> {data.publish_date}
          </p>
          <p className="text-base">
            <span>Nombre de pages :</span> {data.number_of_pages}
          </p>
          <p className="text-base">
            <span>IBSN :</span> {Props.isbn}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
