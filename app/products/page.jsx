'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortDropdown from '../components/SortDropdown';
import ResetButton from '../components/ResetButton';
import { getProducts } from '../lib/api';

const ITEMS_PER_PAGE = 20;

/**
 * A Next.js page that displays a list of products with advanced search, filtering, and sorting capabilities.
 *
 * The page fetches products from the API based on the current URL parameters and displays them in a grid.
 * The user can search products by title, filter by categories, sort by price, and navigate through the pages.
 * The page also displays a search bar, category filter, sort dropdown, and a reset button to clear all filters.
 *
 * @returns {JSX.Element} The rendered page.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
  /**
   * Fetches products from the API with the current search, category, sort, and page parameters.
   * Updates the state with the fetched products, total number of products, and an error if the request fails.
   * Sets loading to true before the request and false after the request has completed.
   */
    async function fetchProducts() {
      try {
        setLoading(true);
        const { products, total } = await getProducts({
          page,
          limit: ITEMS_PER_PAGE,
          search,
          category,
          sort
        });
        setProducts(products);
        setTotalProducts(total);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(`Failed to load products. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page, search, category, sort]);

  /**
   * Updates the URL parameters by merging the given updates with the current searchParams.
   * If an update value is falsy, the corresponding key is removed from the URL parameters.
   * If an update value is truthy, the corresponding key is set to the update value.
   * Finally, the router is pushed with the updated URL parameters.
   *
   * @param {Object} updates - The key-value pairs to update the URL parameters with.
   */
  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  /**
   * Updates the URL parameters by setting the 'search' key to the given searchTerm
   * and resetting the 'page' key to '1'. This will cause the component to re-fetch
   * products with the new search term on the first page.
   *
   * @param {string} searchTerm - The search term to filter the products by.
   */
  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm, page: '1' });
  };


  /**
   * Updates the URL parameters by setting the 'category' key to the given selectedCategory
   * and resetting the 'page' key to '1'. This will cause the component to re-fetch
   * products with the new category on the first page.
   *
   * @param {string} selectedCategory - The selected category to filter the products by.
   */
  const handleCategoryChange = (selectedCategory) => {
    updateParams({ category: selectedCategory, page: '1' });
  };

  /**
   * Updates the URL parameters by setting the 'sort' key to the given sortOption
   * and resetting the 'page' key to '1'. This will cause the component to re-fetch
   * products with the new sort option on the first page.
   *
   * @param {string} sortOption - The sort option to apply to the products. One of
   *    'price_asc', 'price_desc', 'date_asc', 'date_desc', or '' to reset sorting.
   */
  const handleSortChange = (sortOption) => {
    updateParams({ sort: sortOption, page: '1' });
  };



  /**
   * Resets the search, category, and sort options by pushing the '/products'
   * route to the router, which will cause the component to re-fetch products
   * without any filtering or sorting.
   */
  const handleReset = () => {
    router.push('/products');
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <SearchBar onSearch={handleSearch} initialValue={search} />
        <CategoryFilter onCategoryChange={handleCategoryChange} initialValue={category} />
        <SortDropdown onSortChange={handleSortChange} initialValue={sort} />
        <ResetButton onReset={handleReset} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}