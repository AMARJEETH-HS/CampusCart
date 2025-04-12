import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../utils/cart";
import { useSelector } from "react-redux";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center space-x-3 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const imageUrls = product.images?.map(img => 
    `${import.meta.env.VITE_SERVER_URL}/${img}`
  ) || [];
  const isSeller = user && product.user && (user._id === product.user._id);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* IMAGE SECTION */}
          <div className="lg:w-1/2 p-6">
            <div className="relative w-full rounded-lg overflow-hidden bg-white">
              {imageUrls.length > 0 ? (
                <div className="relative">
                  <img
                    src={imageUrls[currentImageIndex]}
                    className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(imageUrls[currentImageIndex])}
                    alt={`Product ${currentImageIndex + 1}`}
                    onError={(e) => e.target.src = "/placeholder.jpg"}
                  />
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-100/90 hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors"
                      >
                        <HiChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100/90 hover:bg-gray-100 p-2 rounded-full shadow-md transition-colors"
                      >
                        <HiChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <img
                  src="/placeholder.jpg"
                  className="w-full h-96 object-cover"
                  alt="Placeholder"
                />
              )}
            </div>
            {imageUrls.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-[#4CAF50]' 
                        : 'bg-gray-300 hover:bg-[#4CAF50]/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div className="lg:w-1/2 p-8 border-l border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              {product.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <span className="text-3xl font-bold text-[#4CAF50]">
                ₹{product.price}
              </span>
              <div className="px-3 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] text-sm font-medium">
                {product.category}
              </div>
              <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                {product.intent}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-4">
              <div>
                <span className="text-gray-600">Stock:</span>
                <span className="ml-2 font-semibold">{product.stock}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                className="w-full bg-[#4CAF50] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#45a049] transition-colors"
                onClick={() => {
                  addToCart(product);
                  alert("Added to cart!");
                }}
              >
                Add to Cart
              </button>

              {isSeller ? (
                <Link 
                  to="/inbox" 
                  className="w-full border-2 border-[#4CAF50] text-[#4CAF50] py-3 px-6 rounded-lg font-semibold hover:bg-[#4CAF50]/10 transition-colors flex items-center justify-center relative"
                >
                  Messages
                  <span className="absolute -top-2 -right-2">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                  </span>
                </Link>
              ) : (
                <Link
                  to={`/chat?receiver=${product.user?._id}`}
                  className="w-full border-2 border-[#4CAF50] text-[#4CAF50] py-3 px-6 rounded-lg font-semibold hover:bg-[#4CAF50]/10 transition-colors"
                >
                  Contact Seller
                </Link>
              )}
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <p>
                  <span className="text-gray-600">Name:</span> 
                  <span className="ml-2 font-medium text-gray-800">{product.user?.name}</span>
                </p>
                <p>
                  <span className="text-gray-600">Contact:</span> 
                  <span className="ml-2 font-medium text-gray-800">{product.user?.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto"
            />
            <div className="p-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}