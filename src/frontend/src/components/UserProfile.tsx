import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { useFetch } from "../hooks/useFetch";
import Spinner from "./Spinner";
import ServerError from "./Errors/ServerError";
import NotFound from "./Errors/NotFound";
import BadRequest from "./Errors/BadRequest";

type Book = {
  id: number;
  title: string;
  cover: string;
  isbn: string;
};

type UserProfileData = Book[]

function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error, execute } = useFetch<UserProfileData>();

  useEffect(() => {
    execute(`/api/profile/${username}`, { credentials: 'include' });
  }, [username, execute]);

  if (loading) return <Spinner />;
  if (error?.status === 404) return <NotFound />;
  if (error?.status === 400) return <BadRequest />;
  if (error || !data) return <ServerError />;

  return (
    <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
      {/* Titre de la collection */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair-sc text-[#6B5B4C] mb-6 md:mb-8 text-center">
        La Collection de <span className=" font-bold text-[#6B5B4C]">{username}</span>
      </h1>

      {/* Grille de livres */}
      {!data || data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg md:text-xl text-gray-600">
            Aucun livre trouvé dans cette collection pour le moment.
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
    </div>
  );
}

export default UserProfile;
