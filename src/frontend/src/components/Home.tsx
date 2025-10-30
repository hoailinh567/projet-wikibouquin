import Card from "./Card";

function Home() {
  return (
    <>
      <div className="flex flex-row m-15 gap-15">
        <div className="basis-auto">
          <div className="flex flex-row-reverse w-full min-h-full bg-[url('/background.jpg')] bg-cover bg-no-repeat rounded-2xl p-5">
            <div className="w-1/2 text-shadow-lg text-white italic">
              <h1 className="text-2xl">Bienvenue !!!</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                error numquam, deserunt odit ipsam vitae culpa. Consequatur,
                delectus ipsum. Fugiat sint aspernatur dicta, unde quam magnam
                earum ad? Magni, illum?. Fugiat sint aspernatur dicta, unde quam
                magnam earum ad? Magni Fugiat sint aspernatur dicta, unde quam
                magnam earum ad? Magni, illum? ... voir plus
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-10 basis-2/3">
          <h1 className="font-playfair-sc font-bold text-3xl inline-flex">
            Coup de coeur <span className="text-red-500">🩷</span>
          </h1>
          <Card
            title="Le Secret de l'amulette"
            pictureUrl="https://covers.openlibrary.org/b/id/3078455-M.jpg"
          />
          <Card
            title="Le Secret de l'amulette"
            pictureUrl="https://covers.openlibrary.org/b/id/3078455-M.jpg"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
