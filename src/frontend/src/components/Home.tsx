import Card from "./Card";

function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row m-4 md:m-8 lg:m-15 gap-4 md:gap-8 lg:gap-15">
        {/* Section bienvenue */}
        <div className="w-full lg:basis-auto">
          <img
            src="/bg-home.jpg"
            alt="background-home WikiBouquin"
            className="w-full h-auto rounded-2xl"
          />
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
