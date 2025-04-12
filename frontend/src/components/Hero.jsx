import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary/80 to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to{" "}
              <span className="text-white drop-shadow-lg">CampusCart</span>
            </h1>
            <p className="text-xl text-white/90">
              Your one-stop marketplace for all campus essentials. Buy, sell, and
              trade with fellow students in a secure and convenient environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}
