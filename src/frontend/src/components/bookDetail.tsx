function BookDetail() {
  return (
    <div className="grow max-w-6xl mx-auto p-5 mt-8 font-playfair-sc text-[#6B5B4C]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Colonne gauche : image + bouton */}
        <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
          <img
            src="https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg"
            alt="Titre du livre"
            className="w-full md:w-full h-auto rounded-lg object-cover"
          />
          <button
            className="bg-[#6B5B4C] text-white px-4 py-2 rounded hover:bg-[#4d3119] transition cursor-"
          >
            Ajouter à ma collection
          </button>
        </div>

        {/* Colonne droite : infos du livre */}
        <div className="flex flex-col text-right gap-2 w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 hover:text-[#311904] transition-colors">
            Titre du Livre
          </h2>
          <p className="text-base"><span className="font-bold">Auteur :</span> Nom de l'auteur</p>
          <p className="text-base"><span className="font-bold">Date de création :</span> 2025-10-24</p>
          <p className="text-base"><span className="font-bold">Nombre de pages :</span> 350</p>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
