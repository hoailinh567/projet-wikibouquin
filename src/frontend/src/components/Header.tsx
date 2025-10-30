function Header() {
  return (
    <header className="mb-2 p-3 bg-[#f5f0eb]">
      <div className="flex justify-between items-center font-playfair-sc text-lg font-bold mb-3">
        <div className="flex gap-4">
          <a href="#">Nouveautés</a>
          <a href="#">Qui sommes-nous ?</a>
        </div>

        <div className="relative flex items-center gap-2">
          <a href="#">
            <img
              src="/icon_profile.jpg"
              alt="icone profile"
              className="h-8 w-8 rounded-full object-cover border border-gray-300 inline-block"
            />
            Mon profil
          </a>
        </div>
      </div>

      {/*logo + nom à gauche*/}
      <div className="flex justify-between items-center text-[#6B5B4C]">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="logo WikiBouquin"
            className="h-10 w-10 rounded-full object-cover inline"
          />
          <h1 className="text-3xl font-bold font-playfair-sc">Wiki Bouquin</h1>
        </a>

        {/* Barre de recherche */}
        <div className="flex w-full max-w-[800px]">
          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            className="grow border bg-gray-50 border-gray-300 rounded-l-full px-4 py-2 focus:outline-none text-sm font-playfair"
          />
          <button className="flex items-center justify-center bg-[#6C7A89] px-4 py-2 rounded-r-full hover:bg-[#07315f] transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
