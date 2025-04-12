import { Link } from "react-router-dom";
import { FaLaptop, FaBook, FaTools, FaCar, FaBox } from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: <FaLaptop className="text-4xl" />,
    color: "from-blue-500 to-blue-600",
    link: "/marketplace?category=Electronics"
  },
  {
    id: 2,
    name: "Books",
    icon: <FaBook className="text-4xl" />,
    color: "from-green-500 to-green-600",
    link: "/marketplace?category=Books"
  },
  {
    id: 3,
    name: "Electrical",
    icon: <FaTools className="text-4xl" />,
    color: "from-yellow-500 to-yellow-600",
    link: "/marketplace?category=Electrical"
  },
  {
    id: 4,
    name: "Vehicles",
    icon: <FaCar className="text-4xl" />,
    color: "from-red-500 to-red-600",
    link: "/marketplace?category=Vehicles"
  },
  {
    id: 5,
    name: "Miscellaneous",
    icon: <FaBox className="text-4xl" />,
    color: "from-purple-500 to-purple-600",
    link: "/marketplace?category=Miscellaneous"
  }
];

export default function CategoryCards() {
  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className={`group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-40 bg-gradient-to-br ${category.color} p-6 flex flex-col items-center justify-center`}
            >
              <div className="text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-white text-lg font-semibold text-center group-hover:scale-105 transition-transform duration-300">
                {category.name}
              </h3>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 