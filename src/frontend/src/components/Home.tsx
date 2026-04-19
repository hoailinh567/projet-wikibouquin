import Card from "./Card";

function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row m-4 md:m-8 lg:m-15 gap-4 md:gap-8 lg:gap-15">
        {/* Section bienvenue */}
        <div className="w-full lg:basis-auto">
          <div className="flex flex-row-reverse w-full min-h-[200px] md:min-h-[300px] lg:min-h-full bg-[url('/bg-home.jpg')] bg-cover bg-center bg-no-repeat rounded-2xl p-4 md:p-6 lg:p-5">
            <div className="w-full lg:w-1/2 text-shadow-lg italic">
              <h1 className="text-xl text-center md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
                Bienvenue sur WikiBouquin !
              </h1>
              <p className="text-sm md:text-base text-left">
                L’endroit où les livres se cachent… jusqu’à ce que vous les
                trouviez ! Recherchez vos livres préférés et ajoutez-les
                tranquillement à votre collection personnelle. Certains livres
                restent bien au chaud, visibles seulement par ceux qui ont le
                droit. Envie de partager ? Faites circuler vos coups de cœur
                avec les autres lecteurs. Et pour une belle surprise, jetez un
                œil à côté … votre prochain coup de cœur vous y attend ...
              </p>
            </div>
          </div>
        </div>

        {/* Section coups de coeur */}
        <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10 w-full lg:basis-2/3">
          <h1 className="font-playfair-sc font-bold text-2xl md:text-3xl inline-flex items-center gap-2">
            Coup de coeur <span className="text-red-500">🩷</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 w-full">
            <Card
              title="Pourquoi je suis devenu une fille"
              pictureUrl="https://covers.openlibrary.org/b/isbn/2330014880-M.jpg"
              isbn="2330014880"
            />
            <Card
              title="Raison et sentiments"
              pictureUrl="https://covers.openlibrary.org/b/isbn/2909240258-M.jpg"
              isbn="2909240258"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
