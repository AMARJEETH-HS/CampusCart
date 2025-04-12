import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "Electronics",
  "Books",
  "Electrical",
  "Vehicles",
  "Miscellaneous",
];

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    description: "",
    price: "",
    stock: "",
    intent: "Buy",
  });
  const [touched, setTouched] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Validation checks
  const errors = {
    name: !form.name ? "Product name is required" : "",
    price: !form.price ? "Price is required" : form.price <= 0 ? "Must be positive" : "",
    stock: !form.stock ? "Stock is required" : form.stock < 0 ? "Can't be negative" : "",
    description: !form.description ? "Description is required" : "",
    images: imageFiles.length === 0 ? "At least one image is required" : "",
  };

  const isValid = !Object.values(errors).some(error => error) && imageFiles.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImageFiles(files);
    setTouched(prev => ({ ...prev, images: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      imageFiles.forEach(file => data.append("images", file));

      await axios.post("/api/products", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      // Reset form
      setForm({
        name: "",
        category: categories[0],
        description: "",
        price: "",
        stock: "",
        intent: "Buy",
      });
      setImageFiles([]);
      setTouched({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01]">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-primary">
              Add Product
            </h2>
            <p className="mt-4 text-gray-600">Fill in the details to add your product to the marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Name */}
            <div className="form-control group">
              <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1H6a1 1 0 00-.994.89l-1 9A1 1 0 005 15h10a1 1 0 00.994-1.11l-1-9A1 1 0 0014 4h-3V3a1 1 0 00-1-1zm3 4V3H7v1h6z" clipRule="evenodd" />
                </svg>
                Product Name
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 px-4 py-3 text-lg"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter product name"
              />
              {touched.name && errors.name && (
                <div className="text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Category and Transaction Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="form-control group">
                <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                  Category
                </label>
                <select
                  name="category"
                  className="select select-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 px-4 py-3 text-lg text-gray-700"
                  value={form.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="text-gray-700">{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-control group">
                <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                  Transaction Type
                </label>
                <select
                  name="intent"
                  className="select select-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 px-4 py-3 text-lg text-gray-700"
                  value={form.intent}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Buy" className="text-gray-700">Purchase</option>
                  <option value="Rent" className="text-gray-700">Lease</option>
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="form-control group">
                <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                  Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    className="input input-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 pl-10 pr-4 py-3 text-lg"
                    value={form.price}
                    onChange={handleChange}
                    disabled={loading}
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                {touched.price && errors.price && (
                  <div className="text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.price}
                  </div>
                )}
              </div>

              <div className="form-control group">
                <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                  Stock Units
                </label>
                <input
                  type="number"
                  name="stock"
                  className="input input-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 px-4 py-3 text-lg"
                  value={form.stock}
                  onChange={handleChange}
                  disabled={loading}
                  min="0"
                  placeholder="Enter stock quantity"
                />
                {touched.stock && errors.stock && (
                  <div className="text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.stock}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-control group">
              <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                Description
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50 px-4 py-3 text-lg h-32"
                value={form.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter product description"
              />
              {touched.description && errors.description && (
                <div className="text-red-500 mt-2 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="form-control group">
              <label className="label font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors duration-200">
                Product Images (Max 3)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-200 bg-gray-50/50">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">Drag and drop images here, or click to select files</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="file-input file-input-bordered w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>
                {touched.images && errors.images && (
                  <div className="text-red-500 mt-4 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.images}
                  </div>
                )}
                {imageFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.map((file, index) => (
                        <span key={index} className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn w-full bg-primary text-white hover:bg-primary/90 rounded-xl py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Adding Product...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Add Product
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}