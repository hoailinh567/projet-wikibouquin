type CardProps = {
  title: string;
  pictureUrl: string;
  isbn: string;
};

function Card(Props: CardProps) {
  return (
    <div className="w-64 h-96 bg-[#f5f0eb] text-center border border-gray-300 rounded-lg shadow-md p-4">
      <a href={`/book/${Props.isbn}`}>
        <img
          className="rounded-t-lg mx-auto object-contain h-48 w-full"
          src={Props.pictureUrl}
          alt=""
        />
      </a>
      <div className="p-5">
        <p className="line-clamp-2 text-lg font-bold mb-5">{Props.title}</p>
        <a href={`/book/${Props.isbn}`}>En savoir plus ➡️</a>
      </div>
    </div>
  );
}

export default Card;
