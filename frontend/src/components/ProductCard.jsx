import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";

export default function ProductCard({ product }) {
  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart!");
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={
            product.images && product.images.length > 0
              ? `${import.meta.env.VITE_SERVER_URL}/${product.images[0]}`
              : "/placeholder.jpg"
          }
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              ₹{product.price}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="text-center text-primary text-sm font-medium hover:text-primary/80 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}