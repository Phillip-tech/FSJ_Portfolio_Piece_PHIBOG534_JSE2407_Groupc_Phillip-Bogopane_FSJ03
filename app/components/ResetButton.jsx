// app/components/ResetButton.jsx
"use client";

/**
 * The ResetButton component displays a button that when clicked will
 * call the onReset function, which is expected to reset the current
 * filters to their default state.
 *
 * @param {Function} onReset The function to call when the button is clicked
 * @returns {JSX.Element} A JSX element representing the ResetButton component
 */
const ResetButton = ({ onReset }) => {
  return (
    <button 
      onClick={onReset}
      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
    >
      Reset Filters
    </button>
  );
};

export default ResetButton;