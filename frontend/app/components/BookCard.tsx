import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    averageRating: number;
    genre: string;
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="h-64 overflow-hidden">
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-500 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  fill={i < Math.round(book.averageRating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({book.averageRating.toFixed(1)})</span>
          </div>
          <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
            {book.genre}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;