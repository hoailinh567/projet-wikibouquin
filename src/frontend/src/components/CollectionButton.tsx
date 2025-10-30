import { useState } from "react";

function CollectionButton() {
  const [bookAdded, setBookAdded] = useState<Boolean>(false);

  // add book
  const addBookToCollection = async () => {
      setBookAdded(true);
      // call api
  };

  // remove book
  const removeBookFromCollection = async () => {
      setBookAdded(false);
      // call api
  };

  return (
    <button
      onClick={bookAdded ? removeBookFromCollection : addBookToCollection}
      className="bg-[#6C7A89] text-white px-4 py-2 rounded hover:bg-[#07315f] transition cursor-pointer"
    >
      {bookAdded ? "Retirer de ma collection" : "Ajouter à ma collection"}
    </button>
  );
}

export default CollectionButton;
