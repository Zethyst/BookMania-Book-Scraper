import React, { useState, useContext } from 'react';
import { Star } from 'lucide-react';
import BookContext from '../context/BookContext';
import AuthContext from '../context/AuthContext';

interface ReviewFormProps {
  bookId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addReview } = useContext(BookContext);
  const { isAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to submit a review');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      setError('Please enter a comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addReview(bookId, rating, comment);
      setRating(0);
      setComment('');
      setError(null);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-700 mb-2">You need to be logged in to leave a review.</p>
        <a href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
          Login to write a review
        </a>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
  <h3 className="text-xl font-bold text-yellow-900 mb-6">Write a Review</h3>

  {error && (
    <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit}>
    <div className="mb-5">
      <label className="block text-sm font-medium text-yellow-900 mb-2">
        Your Rating
      </label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-7 w-7 cursor-pointer transition ${
              (hoverRating || rating) >= star
                ? 'text-yellow-500 fill-current'
                : 'text-yellow-200'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>
    </div>

    <div className="mb-5">
      <label htmlFor="comment" className="block text-sm font-medium text-yellow-900 mb-2">
        Your Review
      </label>
      <textarea
        id="comment"
        rows={4}
        className="w-full px-4 py-3 border border-yellow-200 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this book..."
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition ${
        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {isSubmitting ? 'Submitting...' : 'Submit Review'}
    </button>
  </form>
</div>

  );
};

export default ReviewForm;