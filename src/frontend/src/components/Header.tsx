import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Header() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popupRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/research?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fermer le popup si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !(popupRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="p-3 md:p-4 bg-[#f5f0eb]">
      <div className="flex justify-between items-center font-playfair-sc text-sm md:text-lg font-bold mb-3">
        <div className="flex gap-2 md:gap-4">
          <Link to="/nouveautes" className="hover:text-[#07315f] transition">
            Nouveautés
          </Link>
          <Link to="/about-us" className="hover:text-[#07315f] transition">
            Qui sommes-nous ?
          </Link>
        </div>

        <div className="relative flex items-center gap-2" ref={popupRef}>
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition"
          >
            <img
              src="/icon_profile.jpg"
              alt="icone profile"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover border border-gray-300 inline-block"
            />
            <span className="hidden sm:inline">
              {isAuthenticated && user ? user.username : "Mon profil"}
            </span>
          </button>
          <div
            className={`absolute top-full right-0 mt-2 min-w-fit whitespace-nowrap bg-white border border-gray-300 rounded shadow-lg z-50 transform transition-all duration-200 ease-out
              ${
                isPopupOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setIsPopupOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Mon compte
                </Link>
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => setIsPopupOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Mon profil public
                </Link>
                <Link
                  to="/edit-my-collection"
                  onClick={() => setIsPopupOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Gérer ma collection
                </Link>
                <button
                  onClick={async () => {
                    setIsPopupOpen(false);
                    await logout();
                    navigate("/");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsPopupOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsPopupOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo + Barre de recherche */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-[#6B5B4C]">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="logo WikiBouquin"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover inline"
          />
          <h1 className="text-xl md:text-3xl font-bold font-playfair-sc whitespace-nowrap">
            Wiki Bouquin
          </h1>
        </a>

        <form
          onSubmit={handleSearch}
          className="flex w-full md:max-w-[600px] lg:max-w-[800px]"
        >
          <input
            type="text"
            placeholder="Rechercher un livre par son nom, un auteur, ISBN-10, mot de clé, ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow border bg-gray-50 border-gray-300 rounded-l-full px-3 md:px-4 py-2 focus:outline-none text-xs md:text-sm font-playfair"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-[#6C7A89] px-3 md:px-4 py-2 rounded-r-full hover:bg-[#07315f] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#fff"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
