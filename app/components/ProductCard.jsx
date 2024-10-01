import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';


/**
 * The ProductCard component displays a product card with its image, title, category, price, rating, and a "View Details" and "Add to Cart" button.
 *
 * @param {{ product: { id: number, title: string, category: string, price: number, rating: number, images: string[], discountPercentage: number } }} props - The props object containing the product data.
 *
 * @returns {JSX.Element} The JSX element representing the product card.
 */

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // The index of the current selected image.
  const [imageError, setImageError] = useState(false); // Indicates whether an error occurred while loading the image.

   // Handle the error when loading the image.
   const handleImageError = () => {
    setImageError(true);
  };

  // Navigate to the next image.
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to the previous image.
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
      <div className="relative h-64">
        {product.images && product.images.length > 0 && !imageError ? (
          <>
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.title} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="contain"
              className="transition-opacity duration-300 hover:opacity-75"
              onError={handleImageError}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">
                {imageError ? "Image failed to load" : "No image available"}
              </span>
            </div>
          )}
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2 truncate">{product.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-semibold text-green-500">${product.price.toFixed(2)}</p>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center"
              onClick={() => console.log('Add to cart clicked')} 
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductCard;