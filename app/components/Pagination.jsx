'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * The Pagination component displays a pagination bar with previous, current, and next buttons.
 *
 * @param {Object} props - The component props.
 * @param {number} props.currentPage - The current page number.
 * @returns {JSX.Element} - The Pagination component.
 */
const Pagination = ({ currentPage }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a URL for the specified page number, preserving existing search parameters.
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <Link href={createPageURL(currentPage - 1)} className={`mx-2 px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Previous
      </Link>
      <span className="mx-2 px-4 py-2 bg-gray-200 rounded">{currentPage}</span>
      <Link href={createPageURL(currentPage + 1)} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">
        Next
      </Link>
    </div>
  );
};

export default Pagination;