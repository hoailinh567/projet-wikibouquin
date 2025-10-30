function Footer() {
  return (
    <footer className="mt-2 p-3 bg-[#f5f0eb] shadow-inner font-playfair-sc text-[#6B5B4C]">
      <div className="flex justify-center items-center gap-6 text-xs">
        <a
          href="/mentions-legales"
          className="cursor-pointer hover:text-[#311904] transition-colors"
        >
          Mentions légales
        </a>

        <a
          href="/contact"
          className="cursor-pointer hover:text-[#311904] transition-colors"
        >
          Contact
        </a>

        <a
          href="/politique-de-confidentialite"
          className="cursor-pointer hover:text-[#311904] transition-colors"
        >
          Politique de confidentialité
        </a>
        <a
          href="/condiitions-generales-utilisation"
          className="cursor-pointer hover:text-[#311904] transition-colors"
        >
          Conditions générales d'utilisation
        </a>

        <span className="text-[#6B5B4C]">
          &copy; {new Date().getFullYear()} Wiki Bouquin
        </span>
      </div>
    </footer>
  );
}

export default Footer;
