import Card from "./Card";

function NewArrival() {
    return (
      <>
        <div className="grow max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-6 font-playfair">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6">
            Les nouveautés sont arrivées ici{" "}
            <span className="text-red-500">🩷</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 w-full">
            <Card
              title="Guide vert"
              pictureUrl="https://covers.openlibrary.org/b/isbn/226303076X-M.jpg"
              isbn="226303076X"
            />
            <Card
              title="Verte"
              pictureUrl="https://covers.openlibrary.org/b/isbn/2211089992-M.jpg"
              isbn="2211089992"
            />
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
            <Card
              title="La servante écarlate"
              pictureUrl="https://covers.openlibrary.org/b/isbn/2221203321-M.jpg"
              isbn="2221203321"
            />
            <Card
              title="The Best of Paris"
              pictureUrl="https://covers.openlibrary.org/b/isbn/1881066037-M.jpg"
              isbn="1881066037"
            />
            <Card
              title="Los Cuatro Grandes"
              pictureUrl="https://covers.openlibrary.org/b/isbn/8427285086-M.jpg"
              isbn="8427285086"
            />
            <Card
              title="Paris for free (or extremely cheap)"
              pictureUrl="https://covers.openlibrary.org/b/isbn/0914457586-M.jpg"
              isbn="0914457586"
            />
          </div>
        </div>
      </>
    ); 
}

export default NewArrival;