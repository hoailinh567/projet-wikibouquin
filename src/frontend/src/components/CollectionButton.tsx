import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {
  hasBook?: boolean;
  isbn?: string;
  setHasBook: (hasBook: boolean) => void;
};

function CollectionButton({ hasBook, setHasBook, isbn }: Props) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  // add book
  const addBookToCollection = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/api/edit-my-collection/add`,
        {
          method: "POST",
          body: JSON.stringify({
            isbn: isbn,
            collection_id: user?.collection_ids[0],
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setHasBook(true);
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

  // remove book
  const removeBookFromCollection = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/api/edit-my-collection/delete`,
        {
          method: "DELETE",
          body: JSON.stringify({
            isbn: isbn,
            collection_id: user?.collection_ids[0],
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setHasBook(false);
    } catch (error) {
      console.error("Error removing book from collection:", error);
    }
  };

  const handleUnauthClick = () => {
    // redirect to signin (you can change to "/signup" if you prefer)
    navigate("/signin", { state: { from: `/book/${isbn ?? ""}` } });
  };
  
  return (
    <>
      <button
        onClick={
          isAuthenticated
            ? hasBook
              ? removeBookFromCollection
              : addBookToCollection
            : handleUnauthClick
        }
        className="bg-[#6C7A89] text-white px-4 py-2 rounded hover:bg-[#07315f] transition cursor-pointer"
      >
        {hasBook ? "Retirer de ma collection" : "Ajouter à ma collection"}
      </button>
    </>
  );
}

export default CollectionButton;
