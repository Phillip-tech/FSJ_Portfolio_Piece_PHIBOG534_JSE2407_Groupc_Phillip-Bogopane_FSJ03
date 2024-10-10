'use client';

import React, { Suspense, useState, useEffect } from 'react';
import ProductGallery from '../../components/ProductGallery';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Star, ShoppingCart, Facebook, Instagram, Twitter, Edit, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import useAuth from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

const GoBackButton = dynamic(() => import('../../components/GoBackButton'), { ssr: false });

export default function ProductPage({ params }) {
  const { user, signIn, signUp, signOut } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('date');
  const [sortedReviews, setSortedReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReview, setNewReview] = useState({ reviewerName: '', reviewerEmail: '', rating: 5, comment: '' });
  const [authCredentials, setAuthCredentials] = useState({ displayName: '', email: '', password: '' });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const fetchedProduct = await res.json();
        setProduct(fetchedProduct);
        updateAverageRating(fetchedProduct.reviews);
        setSortedReviews(fetchedProduct.reviews);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error fetching product:', err);
      }
    }
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      document.title = product.title;
    }
  }, [product]);

  useEffect(() => {
    if (product?.reviews) {
      sortReviews();
    }
  }, [sortOption, product]);

  const updateAverageRating = (reviews) => {
    const avg = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    setAverageRating(avg || 0);
  };

  const sortReviews = () => {
    let sorted = [...product.reviews];
    switch (sortOption) {
      case 'rating-asc':
        sorted = sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        sorted = sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'date-asc':
        sorted = sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        sorted = sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      default:
        sorted = sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }
    setSortedReviews(sorted);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'signup') {
        await signUp(authCredentials.email, authCredentials.password, authCredentials.displayName);
      } else {
        await signIn(authCredentials.email, authCredentials.password);
      }
      setIsAuthModalOpen(false);
      setAuthCredentials({ displayName: '', email: '', password: '' });
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleAddReview = () => {
    if (user) {
      setIsAddingReview(true);
      setEditingReviewId(null);
      setNewReview({ reviewerName: user.displayName || '', reviewerEmail: user.email, rating: 5, comment: '' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleEditReview = (review) => {
    if (user) {
      setIsAddingReview(true);
      setEditingReviewId(review.id);
      setNewReview({ ...review });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        const updatedReviews = product.reviews.filter(review => review.id !== reviewId);
        setProduct({ ...product, reviews: updatedReviews });
        updateAverageRating(updatedReviews);
        sortReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review. Please try again later.');
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const reviewData = {
        ...newReview,
        productId: product.id,
        userId: user.uid,
        date: new Date().toISOString()
      };
      let updatedReviews;
      if (editingReviewId) {
        await updateDoc(doc(db, 'reviews', editingReviewId), reviewData);
        updatedReviews = product.reviews.map(review =>
          review.id === editingReviewId ? { ...reviewData, id: editingReviewId } : review
        );
      } else {
        const docRef = await addDoc(collection(db, 'reviews'), reviewData);
        updatedReviews = [...product.reviews, { ...reviewData, id: docRef.id }];
      }
      setProduct({ ...product, reviews: updatedReviews });
      updateAverageRating(updatedReviews);
      sortReviews();
      setIsAddingReview(false);
      setEditingReviewId(null);
      setNewReview({ reviewerName: '', reviewerEmail: '', rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again later.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAddingReview(false);
      setEditingReviewId(null);
      setNewReview({ reviewerName: '', reviewerEmail: '', rating: 5, comment: '' });
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError('Failed to sign out. Please try again.');
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!product) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <GoBackButton />
      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={product.images} />
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center mb-4">
              <p className="text-2xl font-semibold mr-2">${product.price.toFixed(2)}</p>
              {product.discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span>{averageRating.toFixed(1)}/5 ({product.reviews.length} reviews)</span>
            </div>
            <p className="mb-4">{product.description}</p>
            <p className="mb-2">Category: {product.category}</p>
            <p className="mb-2">Brand: {product.brand}</p>
            <p className="mb-4">Stock: {product.stock} available</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </Suspense>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-center mb-8">Customer Reviews</h2>
        <div className="flex justify-between items-center mb-4">
          {user ? (
            <>
              <button
                onClick={handleAddReview}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
              >
                Add Review
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              Sign In to Review
            </button>
          )}
          <div className="relative inline-block">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="rating-desc">Rating (High to Low)</option>
            </select>
          </div>
        </div>
        <div>
          {sortedReviews.map((review) => (
            <div key={review.id} className="p-4 mb-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{review.rating}/5</span>
                </div>
                {user && user.uid === review.userId && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="font-semibold mb-1">{review.reviewerName}</p>
              <p className="text-sm mb-1">{new Date(review.date).toLocaleDateString()}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {isAddingReview && (
        <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">{editingReviewId ? 'Edit Review' : 'Add a Review'}</h3>
          <div className="mb-4">
            <label htmlFor="reviewerName" className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              id="reviewerName"
              value={newReview.reviewerName}
              onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reviewerEmail" className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              id="reviewerEmail"
              value={newReview.reviewerEmail}
              onChange={(e) => setNewReview({ ...newReview, reviewerEmail: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block font-semibold mb-2">Rating</label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block font-semibold mb-2">Comment</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              rows="4"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
  
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              {editingReviewId ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Social Media Links */}
      <div className="flex justify-center space-x-4 mt-8">
        <a href="https://facebook.com" className="text-blue-600 hover:text-blue-800">
          <Facebook className="w-6 h-6" />
        </a>
        <a href="https://instagram.com" className="text-pink-600 hover:text-pink-800">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="https://twitter.com" className="text-blue-400 hover:text-blue-600">
          <Twitter className="w-6 h-6" />
        </a>
      </div>

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">{authMode === 'signup' ? 'Sign Up' : 'Sign In'}</h3>
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="mb-4">
                  <label htmlFor="displayName" className="block font-semibold mb-2">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={authCredentials.displayName}
                    onChange={(e) => setAuthCredentials({ ...authCredentials, displayName: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={authCredentials.email}
                  onChange={(e) => setAuthCredentials({ ...authCredentials, email: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block font-semibold mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={authCredentials.password}
                  onChange={(e) => setAuthCredentials({ ...authCredentials, password: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                  {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
                <p
               className="text-sm text-blue-500 hover:underline cursor-pointer"
               onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
             >
               {authMode === 'signup' ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
             </p>
              </div>
              {authError && <p className="text-red-500 mt-4">{authError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}