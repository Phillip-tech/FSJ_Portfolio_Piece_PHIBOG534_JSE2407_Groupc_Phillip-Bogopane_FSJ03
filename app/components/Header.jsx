'use client';
import { useState } from 'react';
import Link from 'next/link'; // Correct import

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggle the hamburger menu state between open and closed.
   */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-blue-500">NextEcommerce</span>
        </Link>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links (visible on larger screens) */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/products">
            <span className="text-gray-700 hover:text-blue-500">Products</span>
          </Link>
          {/* Commented out 'About' and 'Contact' links */}
          {/* <Link href="/about">
            <span className="text-gray-700 hover:text-blue-500">About</span>
          </Link>
          <Link href="/contact">
            <span className="text-gray-700 hover:text-blue-500">Contact</span>
          </Link> */}
        </nav>
      </div>

      {/* Mobile Menu (visible when the hamburger icon is clicked) */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md py-4">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <Link href="/products">
                <span onClick={toggleMenu} className="text-gray-700 hover:text-blue-500">Products</span>
              </Link>
            </li>
            {/* Commented out 'About' and 'Contact' links */}
            {/* <li>
              <Link href="/about">
                <span onClick={toggleMenu} className="text-gray-700 hover:text-blue-500">About</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span onClick={toggleMenu} className="text-gray-700 hover:text-blue-500">Contact</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;