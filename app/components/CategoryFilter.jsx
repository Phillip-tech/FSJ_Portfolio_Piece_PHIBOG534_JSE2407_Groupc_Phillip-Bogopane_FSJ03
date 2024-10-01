"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * A component that renders a dropdown for filtering products by category.
 *
 * It watches the URL for changes to the 'category' parameter and updates the
 * selected category in the state.
 *
 * When the user selects a category, it updates the URL by setting the 'category'
 * parameter to the selected category and setting the 'page' parameter to 1.
 *
 * @returns {JSX.Element} A select element with options for each category.
 */
const CategoryFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  /**
   * Handles a change to the selected category by updating the URL parameter
   * and resetting pagination to 1.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e The change event.
   */
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', 1); // Reset pagination when filtering
    router.push(`/products?${params.toString()}`);
  };

  const categories = [
    { id: 1, name: 'beauty' },
    { id: 2, name: 'fragrances' },
    { id: 3, name: 'furniture' },
    { id: 4, name: 'groceries' },
    { id: 5, name: 'home-decoration' },
    { id: 6, name: 'kitchen-accessories' },
    { id: 7, name: 'laptops' },
    { id: 8, name: 'mens-shirts' },
    { id: 9, name: 'mens-shoes' },
    { id: 10, name: 'mens-watches' },
    { id: 11, name: 'mobile-accessories' },
    { id: 12, name: 'motorcycle' },
    { id: 13, name: 'skin-care' },
    { id: 14, name: 'smartphones' },
    { id: 15, name: 'sports-accessories' },
    { id: 16, name: 'sunglasses' },
    { id: 17, name: 'tablets' },
    { id: 18, name: 'tops' },
    { id: 19, name: 'vehicle' },
    { id: 20, name: 'womens-bags' },
    { id: 21, name: 'womens-dresses' },
    { id: 22, name: 'womens-jewellery' },
    { id: 23, name: 'womens-shoes' },
    { id: 24, name: 'womens-watches' },  ];

  return (
    <select value={selectedCategory} onChange={handleCategoryChange} className="p-2 border">
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.name}>{cat.name}</option>
      ))}
    </select>
  );
};

export default CategoryFilter;






