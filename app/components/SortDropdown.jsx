"use client";

import { useState, useEffect } from 'react';

/**
 * The SortDropdown component displays a dropdown menu for selecting a sorting option.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSortChange - A callback function that is called when the user selects a sorting option.
 * @param {string} [props.initialValue] - The initial selected sorting option.
 * @returns {JSX.Element} - The SortDropdown component.
 */
const SortDropdown = ({ onSortChange, initialValue }) => {
  const [sortOption, setSortOption] = useState(initialValue || '');

  useEffect(() => {
    setSortOption(initialValue || '');
  }, [initialValue]);

  /**
   * Handles a change to the selected sorting option by updating the component state
   * and calling the onSortChange callback function with the new sorting option.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    onSortChange(option);
  };

  return (
    <select 
      value={sortOption} 
      onChange={handleSortChange} 
      className="p-2 border rounded"
    >
      <option value="">Default Sorting</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
};

export default SortDropdown;