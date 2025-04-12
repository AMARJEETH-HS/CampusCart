import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/auth/me`, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setProfile(data);
        if (data.avatar) {
          const avatarUrl = `${SERVER_URL}/uploads/avatars/${data.avatar}`;
          const img = new Image();
          img.onload = () => setImagePreview(avatarUrl);
          img.onerror = () => {
            setImagePreview(null);
            toast.error("Profile image not found");
          };
          img.src = avatarUrl;
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Please login to view your profile");
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [SERVER_URL, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedImage);

      const { data } = await axios.put(
        `${SERVER_URL}/api/auth/update-profile`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true
        }
      );

      setProfile(data);
      setSelectedImage(null);
      setImagePreview(`${SERVER_URL}/uploads/avatars/${data.avatar}`);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update your profile");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile photo");
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#1E3A8A]">Your Profile</h1>

        <div className="card bg-white shadow-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={() => {
                    setImagePreview(null);
                    toast.error("Failed to load profile image");
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                  <FaUser className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {user && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-all duration-300 group-hover:scale-110">
                  <FaCamera className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {selectedImage && (
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`mt-4 px-4 py-2 rounded-lg transition-all duration-300 ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4CAF50] hover:bg-[#45a049]"
                } text-white`}
              >
                {uploading ? "Uploading..." : "Update Photo"}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Campus</p>
              <p className="text-lg text-gray-900">{profile.hostel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg text-gray-900">{profile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


