function Footer() {
  return (
    <footer className="p-4 md:p-6 bg-[#f5f0eb] shadow-inner font-playfair-sc text-[#6B5B4C]">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 md:gap-6 text-xs">
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
          className="cursor-pointer hover:text-[#311904] transition-colors text-center"
        >
          Politique de confidentialité
        </a>
        <a
          href="/condiitions-generales-utilisation"
          className="cursor-pointer hover:text-[#311904] transition-colors text-center"
        >
          Conditions générales d'utilisation
        </a>

        <span className="text-[#6B5B4C] w-full sm:w-auto text-center mt-2 sm:mt-0">
          &copy; {new Date().getFullYear()} Wiki Bouquin
        </span>
      </div>
    </footer>
  );
}

export default Footer;
