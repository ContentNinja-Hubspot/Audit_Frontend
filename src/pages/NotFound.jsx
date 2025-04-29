import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
          Oops! Page not found.
        </p>
        <p className="text-gray-500 my-4">
          Looking deep, you can find God. But the page you're looking for
          doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
