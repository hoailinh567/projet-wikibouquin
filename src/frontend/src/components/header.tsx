function Header() {
  return (
    <header className="mb-2 p-3 bg-white shadow-md">
      <div className="flex justify-between items-center font-playfair-sc text-lg font-bold mb-3 text-[#6B5B4C]">
        <div className="flex gap-4">
          <div className="cursor-pointer hover:text-[#311904] transition-colors">Nouveautés</div>
          <div className="cursor-pointer hover:text-[#311904] transition-colors">Qui sommes-nous ?</div>
        </div>

        <div className="relative flex items-center gap-2">
          <img
            src="/iconProfil.jpg"
            alt="profil"
            className="h-8 w-8 rounded-full object-cover border border-gray-300 cursor-pointer"
          />
          <button
            className="cursor-pointer hover:text-[#311904] transition-colors text-base"
          >
            Mon profil
          </button>
        </div>
      </div>

      {/*logo + nom à gauche, barre de recherche à droite */}
      <div className="flex justify-between items-center">
        {/* Logo + texte du logo */}
        <div className="flex items-center gap-2 text-[#6B5B4C]">
          <img
            src="/logo.jpg"
            alt="logo WikiBouquin"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1
            className="text-2xl font-playfair-sc font-bold cursor-pointer hover:text-[#311904] transition-colors duration-200"
          >
            Wiki Bouquin
          </h1>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            className="w-[280px] md:w-[800px] border border-gray-300 rounded-r-full px-3 py-1.5 focus:outline-none focus:ring-2 text-sm font-playfair"
          />
          <button
            className="bg-[#6B5B4C] text-white px-6 py-1.5 rounded-r-full hover:bg-[#4d3119] transition text-sm cursor-pointer"
          >
            Rechercher
          </button>
          </div>
        </div>
    </header>
  );
}

export default Header;
