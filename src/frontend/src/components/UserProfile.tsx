import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Card from "./Card";

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  isbn: string;
};

type UserProfileData = {
  username: string;
  publicBooks: Book[];
};

function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch(`http://localhost:3000/api/profile/${username}`);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // const userData = await response.json();
      // setData(userData);

      // Données de placeholder pour le moment
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simule un délai réseau
      setData({
        username: username || "Utilisateur",
        publicBooks: [
          {
            id: 1,
            title: "Alice au pays des merveilles",
            author: "Lewis Carroll",
            cover: "https://covers.openlibrary.org/b/id/12389745-M.jpg",
            isbn: "2800679816",
          },
          {
            id: 2,
            title: "Harry Potter à l'école des sorciers",
            author: "J.K. Rowling",
            cover: "https://covers.openlibrary.org/b/id/8494529-M.jpg",
            isbn: "2070584623",
          },
          {
            id: 3,
            title: "Le Petit Prince",
            author: "Antoine de Saint-Exupéry",
            cover: "https://covers.openlibrary.org/b/id/8231143-M.jpg",
            isbn: "0156012197",
          },
          {
            id: 4,
            title: "1984",
            author: "George Orwell",
            cover: "https://covers.openlibrary.org/b/id/7222246-M.jpg",
            isbn: "0451524934",
          },
          {
            id: 5,
            title: "Le Seigneur des Anneaux",
            author: "J.R.R. Tolkien",
            cover: "https://covers.openlibrary.org/b/id/8504094-M.jpg",
            isbn: "0618640150",
          },
          {
            id: 6,
            title: "Orgueil et Préjugés",
            author: "Jane Austen",
            cover: "https://covers.openlibrary.org/b/id/8235657-M.jpg",
            isbn: "0141439513",
          },
          {
            id: 7,
            title: "Les Misérables",
            author: "Victor Hugo",
            cover: "https://covers.openlibrary.org/b/id/8300605-M.jpg",
            isbn: "0140444300",
          },
          {
            id: 8,
            title: "Le Comte de Monte-Cristo",
            author: "Alexandre Dumas",
            cover: "https://covers.openlibrary.org/b/id/8156473-M.jpg",
            isbn: "0140449264",
          },
          {
            id: 9,
            title: "L'Étranger",
            author: "Albert Camus",
            cover: "https://covers.openlibrary.org/b/id/8221039-M.jpg",
            isbn: "2070360024",
          },
          {
            id: 10,
            title: "Le Meilleur des mondes",
            author: "Aldous Huxley",
            cover: "https://covers.openlibrary.org/b/id/8238640-M.jpg",
            isbn: "0060850523",
          },
          {
            id: 11,
            title: "Fahrenheit 451",
            author: "Ray Bradbury",
            cover: "https://covers.openlibrary.org/b/id/8156453-M.jpg",
            isbn: "1451673264",
          },
          {
            id: 12,
            title: "Dracula",
            author: "Bram Stoker",
            cover: "https://covers.openlibrary.org/b/id/8231091-M.jpg",
            isbn: "0141439846",
          },
        ],
      });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-5 grid h-full place-items-center text-center min-h-[400px]">
        <div>
          <img
            src="/error.jpg"
            alt="Erreur"
            className="mx-auto w-48 h-48 md:w-64 md:h-64 object-contain mb-4"
          />
          <p className="text-xl font-semibold text-red-500">
            Impossible de charger le profil de cet utilisateur
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
      {/* Titre de la collection */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair-sc text-[#6B5B4C] mb-6 md:mb-8 text-center">
        La Collection de <span className="text-[#07315f]">{data.username}</span>
      </h1>

      {/* Grille de livres */}
      {data.publicBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg md:text-xl text-gray-600">
            Cet utilisateur n'a pas encore de livres publics dans sa collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10 justify-items-center">
          {data.publicBooks.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              pictureUrl={book.cover}
              isbn={book.isbn}
            />
          ))}
        </div>
      )}

      {/* Message informatif */}
      <div className="mt-8 md:mt-12 p-4 md:p-6 bg-[#f5f0eb] rounded-lg text-center">
        <p className="text-sm md:text-base text-[#6B5B4C]">
          Seuls les livres publics de la collection de {data.username} sont affichés ici.
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
