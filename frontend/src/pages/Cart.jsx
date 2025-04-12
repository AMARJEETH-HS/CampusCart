import { useEffect, useState } from "react";
import { getCartItems, clearCart, removeFromCart } from "../utils/cart";
import { Link } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const handleClearCart = () => {
    clearCart();
    setItems([]);
  };

  const handleRemoveItem = (indexToRemove) => {
    removeFromCart(indexToRemove);
    const updatedItems = getCartItems();
    setItems(updatedItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-6">
            <img
              src="/industrial-cart.svg"
              alt="Empty cart"
              className="w-72 h-72 opacity-90"
            />
            <p className="text-xl font-medium text-base-content/80">
              Your workshop cart is empty
            </p>
            <Link 
              to="/marketplace" 
              className="btn btn-primary rounded-none px-8 border-2 border-primary hover:border-primary-focus shadow-lg hover:shadow-primary/30"
            >
              Browse Inventory
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="card bg-base-100 border-2 border-base-300 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="card-body flex flex-col sm:flex-row gap-6 p-6">
                    <figure className="w-full sm:w-48 h-48 border-2 border-base-300 rounded-lg overflow-hidden">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? `${import.meta.env.VITE_SERVER_URL}/${item.images[0]}`
                            : "/placeholder-industrial.jpg"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-300"
                      />
                    </figure>

                    <div className="flex-1 space-y-4">
                      <h2 className="card-title text-2xl font-bold uppercase tracking-tight">
                        {item.name}
                      </h2>
                      <p className="text-base-content/80 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          ₹{item.price}
                        </span>
                        <div className="flex gap-3">
                          <Link
                            to={`/products/${item._id}`}
                            className="btn btn-outline btn-sm rounded-none border-2 border-primary hover:border-primary-focus"
                          >
                            Specifications
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="btn btn-error btn-sm rounded-none border-2 border-error hover:border-error-focus"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button 
                onClick={handleClearCart}
                className="btn btn-error rounded-none border-2 border-error hover:border-error-focus bg-gradient-to-br from-error/90 to-error/70 text-base-100 shadow-xl hover:shadow-error/30"
              >
                Purge All Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}