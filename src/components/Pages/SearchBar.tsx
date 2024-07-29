// src/components/SearchBar.tsx
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="relative text-gray-600">
      <input
        type="search"
        name="search"
        placeholder="Buscar..."
        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
      />
      <button type="submit" className="absolute right-0 top-0 mt-2 mr-4">
        <svg
          className="h-4 w-4 fill-current"
          viewBox="0 0 56.966 56.966"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M55.146 51.887l-14.81-14.81c3.486-4.313 5.598-9.787 5.598-15.732 0-13.23-10.747-23.976-23.977-23.976C9.727-2.63.002 7.117.002 20.345s10.746 23.976 23.976 23.976c5.945 0 11.419-2.112 15.732-5.598l14.81 14.81c.392.392.902.588 1.412.588s1.021-.196 1.412-.588c.783-.783.783-2.049 0-2.832zM23.978 37.322c-9.358 0-16.976-7.618-16.976-16.976s7.618-16.976 16.976-16.976 16.976 7.618 16.976 16.976-7.618 16.976-16.976 16.976z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
