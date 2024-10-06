'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
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

function ProductList({ searchParams }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
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

  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm, page: '1' });
  };

  const handleCategoryChange = (selectedCategory) => {
    updateParams({ category: selectedCategory, page: '1' });
  };

  const handleSortChange = (sortOption) => {
    updateParams({ sort: sortOption, page: '1' });
  };

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

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductList searchParams={useSearchParams()} />
     </Suspense> 
  );
}