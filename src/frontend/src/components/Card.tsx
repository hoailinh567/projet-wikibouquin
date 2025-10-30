type CardProps = {
  pictureUrl: string;
  title: string;
};

function Card(Props: CardProps) {
  return (
    <div className="max-w-xs bg-[#f5f0eb] text-center border border-gray-300 rounded-lg shadow-md p-4">
      <a href="#">
        <img
          className="rounded-t-lg mx-auto object-contain h-48 w-full"
          src={Props.pictureUrl}
          alt=""
        />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {Props.title}
          </h5>
        </a>
        <a href="/book/207059517X" className="">
          En savoir plus ➡️
        </a>
      </div>
    </div>
  );
}

export default Card;
