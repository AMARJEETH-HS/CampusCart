 // (if you use this file as is, ignore this line in the frontend)
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { HiOutlineShoppingCart, HiMenu, HiX, HiUser } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".menu-button")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 text-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="CampusCart Logo" className="h-14 w-14" />
              <span className="text-[#4CAF50] text-xl font-bold">CampusCart</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/marketplace"
                className="text-gray-800 hover:text-[#4CAF50] inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Marketplace
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-800 hover:text-[#4CAF50] inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/Announcement"
                    className="text-gray-800 hover:text-[#4CAF50] inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Announcements
                  </Link>
                  <Link
                    to="/addProduct"
                    className="text-gray-800 hover:text-[#4CAF50] inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Add Product
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-800 hover:text-[#4CAF50] inline-flex items-center px-1 pt-1 text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/cart"
                className="relative text-gray-800 hover:text-[#4CAF50]"
              >
                <HiOutlineShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4CAF50] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <HiUser className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/inbox"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Messages
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/marketplace"
            className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Marketplace
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/cart"
                className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Cart
              </Link>
              <Link
                to="/addProduct"
                className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Add Product
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-800 hover:text-[#4CAF50] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
