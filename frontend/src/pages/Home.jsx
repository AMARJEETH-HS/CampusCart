import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { addItem } from "../store/cartSlice";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import CategoryCards from "../components/CategoryCards";

export default function Home() {
  const dispatch = useDispatch();
  const { items: products = [], status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const latestProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Hero />
      <Carousel />
      <CategoryCards />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Latest Products
        </h2>

        {status === "loading" ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
          </div>
        ) : status === "failed" ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏭</div>
            <p className="text-xl font-medium text-gray-600">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {latestProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => dispatch(addItem(product))}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link 
            to="/marketplace" 
            className="bg-[#4CAF50] text-white hover:bg-[#45a049] px-8 py-3 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View More Products
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}