import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Card from "./Card";

type Book = {
  id: number;
  title: string;
  cover: string;
  isbn: string;
};

type UserProfileData = Book[]

function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // appel API pour récupérer les données du profil utilisateur
      const response = await fetch(`http://localhost:3000/api/profile/${username}`, {credentials: 'include'});
      
      if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setData(userData);
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
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair-sc text-[#6B5B4C] mb-6 md:mb-8 text-center">
        La Collection de <span className=" font-bold text-[#6B5B4C]">{username}</span>
      </h1>

      {/* Grille de livres */}
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg md:text-xl text-gray-600">
            Cet utilisateur n'a pas encore de livres publics dans sa collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10 justify-items-center">
          {data.map((book) => (
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
          Seuls les livres publics de la collection de {username} sont affichés ici.
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
