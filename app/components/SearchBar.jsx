"use client";
import { useState, useEffect } from 'react';


/**
 * A component that renders a search bar with a text input and a search button.
 *
 * When the user types a search query and submits the form, it calls the
 * `onSearch` callback with the search query.
 *
 * If the `initialValue` prop is set, it will initialize the search query
 * with that value. Otherwise, it will be empty.
 *
 * @param {{ onSearch: Function, initialValue: string }} props - The component props.
 * @param {Function} props.onSearch - A callback function that will be called when the user submits the search form.
 * @param {string} [props.initialValue] - The initial value of the search query.
 * @returns {JSX.Element} A JSX element representing the search bar.
 */
const SearchBar = ({ onSearch, initialValue }) => {
  const [search, setSearch] = useState(initialValue || '');

  useEffect(() => {
    setSearch(initialValue || '');
  }, [initialValue]);


  /**
   * Handles a search submission by calling the `onSearch` callback with the current search query.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for products..."
        className="p-2 border rounded-l"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">Search</button>
    </form>
  );
};

export default SearchBar;