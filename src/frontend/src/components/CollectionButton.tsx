import { useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

function CollectionButton(Props: { isbn: string }) {
  const { user, isAuthenticated } = useAuth();
  const [bookAdded, setBookAdded] = useState<Boolean>(false);

  // add book
  const addBookToCollection = async () => {
    const response = await fetchWithAuth(
      `http://localhost:3000/api/my-collection/add`,
      {
        method: "POST",
        body: JSON.stringify({
          isbn: Props.isbn,
          collection_id: user?.collection_ids[0],
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    setBookAdded(true);
  };

  // remove book
  const removeBookFromCollection = async () => {
    setBookAdded(false);
    // call api
  };

  return (
    <>
      {isAuthenticated && (
        <button
          onClick={bookAdded ? removeBookFromCollection : addBookToCollection}
          className="bg-[#6C7A89] text-white px-4 py-2 rounded hover:bg-[#07315f] transition cursor-pointer"
        >
          {bookAdded ? "Retirer de ma collection" : "Ajouter à ma collection"}
        </button>
      )}
    </>
  );
}

export default CollectionButton;
