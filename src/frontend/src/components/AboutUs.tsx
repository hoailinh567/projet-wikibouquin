function AboutUs() {
  return (
    <div className="grow max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16 font-playfair text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#6B5B4C] mb-4">
        Qui sommes-nous ?
      </h1>

      <div className="w-16 h-1 bg-[#6B5B4C] mx-auto mb-8 rounded-full" />

      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
        WikiBouquin est né d'une passion simple et universelle :{" "}
        <span className="font-semibold text-[#6B5B4C]">l'amour des livres</span>.
        Nous avons voulu créer un espace où chaque lecteur peut retrouver ses œuvres
        préférées, les organiser dans sa collection personnelle et partager ses coups
        de cœur avec la communauté.
      </p>

      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
        Notre mission est de rendre la littérature{" "}
        <span className="font-semibold text-[#6B5B4C]">accessible à tous</span> —
        que vous soyez un lecteur occasionnel en quête de votre prochaine aventure,
        ou un passionné cherchant à cataloguer chaque page tournée.
      </p>

      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-10">
        Ici, les livres ne se cachent plus. Ils vous attendent.
      </p>

      <div className="flex justify-center gap-8 text-[#6B5B4C]">
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">📚</span>
          <span className="text-sm font-semibold">Des milliers de livres</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🗂️</span>
          <span className="text-sm font-semibold">Votre collection</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🩷</span>
          <span className="text-sm font-semibold">Vos coups de cœur</span>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
