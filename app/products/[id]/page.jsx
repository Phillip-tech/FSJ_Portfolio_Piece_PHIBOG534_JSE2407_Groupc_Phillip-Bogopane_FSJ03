"use client";

import React, { Suspense, useState, useEffect } from 'react';
import ProductGallery from '../../components/ProductGallery';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { Star, ShoppingCart, Facebook, Instagram, Twitter, Phone, Globe, Edit, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const GoBackButton = dynamic(() => import('../../components/GoBackButton'), { ssr: false });

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('date');
  const [sortedReviews, setSortedReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [newReview, setNewReview] = useState({ reviewerName: '', reviewerEmail: '', rating: 5, comment: '' });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/00${params.id}`);
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
    if (product && product.reviews) {
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

  const handleAddReview = () => {
    setIsAddingReview(true);
    setEditingReviewId(null);
    setNewReview({ reviewerName: '', reviewerEmail: '', rating: 5, comment: '' });
  };

  const handleEditReview = (review) => {
    setIsAddingReview(true);
    setEditingReviewId(review.id);
    setNewReview({ ...review });
  };

  const handleDeleteReview = async (reviewId) => {
    const updatedReviews = product.reviews.filter(review => review.id !== reviewId);
    setProduct({ ...product, reviews: updatedReviews });
    updateAverageRating(updatedReviews);
    sortReviews();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    let updatedReviews;
    if (editingReviewId) {
      updatedReviews = product.reviews.map(review =>
        review.id === editingReviewId ? { ...newReview, date: new Date().toISOString() } : review
      );
    } else {
      const newReviewWithId = {
        ...newReview,
        id: Date.now(),
        date: new Date().toISOString()
      };
      updatedReviews = [...product.reviews, newReviewWithId];
    }
    setProduct({ ...product, reviews: updatedReviews });
    updateAverageRating(updatedReviews);
    sortReviews();
    setIsAddingReview(false);
    setEditingReviewId(null);
  };

  if (error) return <ErrorMessage message={error} />;
  if (!product) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <GoBackButton />
      <Suspense fallback={<Loading />}>
        {/* Product details section */}
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
        
        {/* Reviews section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-center mb-8">Customer Reviews</h2>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleAddReview}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              Add Review
            </button>
            <div className="relative inline-block">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Default</option>
                <option value="rating-asc">Rating (Ascending)</option>
                <option value="rating-desc">Rating (Descending)</option>
                <option value="date-asc">Date (Ascending)</option>
                <option value="date-desc">Date (Descending)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L10 14.657l.707-.707.707-.707a1 1 0 0 0-1.414-1.414L10 12.243l-.707-.707a1 1 0 0 0-1.414 1.414z"/></svg>
              </div>
            </div>
          </div>

          {/* Add/Edit Review Form */}
          {isAddingReview && (
            <form onSubmit={handleReviewSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">{editingReviewId ? 'Edit Review' : 'Add Review'}</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewerName">
                  Name
                </label>
                <input
                  type="text"
                  id="reviewerName"
                  value={newReview.reviewerName}
                  onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewerEmail">
                  Email
                </label>
                <input
                  type="email"
                  id="reviewerEmail"
                  value={newReview.reviewerEmail}
                  onChange={(e) => setNewReview({ ...newReview, reviewerEmail: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                  Rating
                </label>
                <select
                  id="rating"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {editingReviewId ? 'Update Review' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingReview(false);
                    setEditingReviewId(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

                   {/* Reviews Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedReviews.map((review) => (
              <div key={review.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative bg-blue-500 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-white">
                      <div className="font-bold">CUSTOMER</div>
                      <div className="text-xs">REVIEW</div>
                    </div>
                    <div className="flex space-x-2">
                      <Facebook className="w-4 h-4 text-white" />
                      <Instagram className="w-4 h-4 text-white" />
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Client</h2>
                  <h1 className="text-4xl font-bold text-white">TESTIMONY</h1>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-500 bg-gray-200">
                      {/* Placeholder for user avatar */}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 pt-12 bg-gray-100">
                  <div className="text-center">
                    <h3 className="font-bold text-xl">{review.reviewerName}</h3>
                    <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
                    <p className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-center text-gray-600 italic mt-4">
                    &quot;{review.comment}&quot;
                  </blockquote>
                </div>
                <div className="flex justify-around px-6 py-4 bg-gray-100">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-2 py-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  );
}