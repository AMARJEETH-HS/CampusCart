import { FaUsers, FaShoppingCart, FaShieldAlt, FaHandshake } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About CampusCart</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted marketplace for campus essentials, connecting students across universities.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At CampusCart, we're dedicated to creating a seamless marketplace experience for students. 
            Our platform enables easy buying, selling, and trading of campus essentials, fostering a 
            sustainable and connected student community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaUsers className="text-4xl text-[#4CAF50] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Community</h3>
            <p className="text-gray-600">
              Join a vibrant community of students from various universities.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaShoppingCart className="text-4xl text-[#4CAF50] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Trading</h3>
            <p className="text-gray-600">
              Simple and secure platform for buying and selling campus essentials.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaShieldAlt className="text-4xl text-[#4CAF50] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Your safety and security are our top priorities.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FaHandshake className="text-4xl text-[#4CAF50] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Service</h3>
            <p className="text-gray-600">
              Reliable platform with verified users and secure transactions.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Team</h2>
          <p className="text-gray-600 mb-6">
            CampusCart is built and maintained by a dedicated team of developers, designers, 
            and student advisors who understand the needs of the student community. We're 
            constantly working to improve your experience and make campus life easier.
          </p>
          <div className="flex justify-center">
            <button className="bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#45a049] transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 