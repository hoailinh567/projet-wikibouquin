import { useState } from "react";

type CardProps = {
  title: string;
  pictureUrl: string;
  isbn: string;
};

const PLACEHOLDER_COVER = "/placeholder-book.jpg";

function Card(Props: CardProps) {
  const [imgSrc, setImgSrc] = useState(Props.pictureUrl);

  const handleImageError = () => {
    if (imgSrc !== PLACEHOLDER_COVER) {
      setImgSrc(PLACEHOLDER_COVER);
    }
  };

  return (
    <div className="w-full max-w-[280px] h-96 bg-[#f5f0eb] text-center border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow">
      <a href={`/book/${Props.isbn}`}>
        <img
          className="rounded-t-lg mx-auto object-contain h-48 w-full"
          src={imgSrc}
          alt={Props.title}
          onError={handleImageError}
        />
      </a>
      <div className="p-3 md:p-5">
        <p className="line-clamp-2 text-base md:text-lg font-bold mb-3 md:mb-5">{Props.title}</p>
        <a href={`/book/${Props.isbn}`} className="text-sm md:text-base hover:underline">
          En savoir plus ➡️
        </a>
      </div>
    </div>
  );
}

export default Card;
