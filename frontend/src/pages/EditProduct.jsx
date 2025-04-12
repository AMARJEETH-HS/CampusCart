import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    intent: "Buy"
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`, {
          withCredentials: true
        });
        setForm(data);
      } catch (err) {
        toast.error("Failed to load product");
        navigate("/dashboard");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${id}`, form, { 
        withCredentials: true 
      });
      navigate("/dashboard");
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Add your full form fields here matching AddProduct.jsx
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Add all form fields from AddProduct component */}
        <div className="form-control">
          <label className="label">Product Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
          />
        </div>
        
        {/* Add other fields... */}
        
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}