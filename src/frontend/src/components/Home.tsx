import Card from "./Card";

function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row m-4 md:m-8 lg:m-15 gap-4 md:gap-8 lg:gap-15">
        {/* Section bienvenue */}
        <div className="w-full lg:basis-auto">
          <div className="flex flex-row-reverse w-full min-h-[200px] md:min-h-[300px] lg:min-h-full bg-[url('/bg-home.jpg')] bg-cover bg-center bg-no-repeat rounded-2xl p-4 md:p-6 lg:p-5">
            <div className="w-full lg:w-1/2 text-shadow-lg text-white italic">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
                Bienvenue !!!
              </h1>
              <p className="text-sm md:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                error numquam, deserunt odit ipsam vitae culpa. Consequatur,
                delectus ipsum. Fugiat sint aspernatur dicta, unde quam magnam
                earum ad? Magni, illum?. Fugiat sint aspernatur dicta, unde quam
                magnam earum ad? Magni Fugiat sint aspernatur dicta, unde quam
                magnam earum ad? Magni, illum? Fugiat sint aspernatur dicta,
                unde quam magnam earum ad? Magni Fugiat sint aspernatur dicta,
                deserunt odit... voir plus
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
              title="Harry Potter à l'école des sorciers"
              pictureUrl="https://covers.openlibrary.org/b/id/8494529-M.jpg"
              isbn="2070584623"
            />
            <Card
              title="The noel diary"
              pictureUrl="https://covers.openlibrary.org/b/id/14501384-M.jpg"
              isbn="1501172034"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
