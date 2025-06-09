import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            image: null,
            address: data.user.address || { line1: "", line2: "" },
            gender: data.user.gender || "Not Selected",
            dob: data.user.dob || "",
            phone: data.user.phone || "",
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch profile");
      }
    };
    if (token) fetchProfile();
  }, [backendUrl, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setError("Only .jpg, .jpeg, or .png files are allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", JSON.stringify(formData.address));
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("phone", formData.phone);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${backendUrl}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setSuccess(data.message);
        setIsEditing(false);
        setFormData((prev) => ({ ...prev, image: null }));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);
  

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>

      <div className="container mx-auto px-6 py-12 pt-16 max-w-4xl">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          >
            {success}
          </motion.div>
        )}

        {!user ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#4B3832]">Loading your profile...</p>
          </div>
        ) : !isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="border-t-4 border-[#D4AF37]"></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {user.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={`${backendUrl}/${user.image}`}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-contain border-4 border-[#D4AF37]"
                      onError={(e) => {
                        e.target.src = "/fallback-image.jpg";
                        setError("Failed to load profile image");
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-2xl font-serif font-bold text-[#4B3832] mb-6 pb-2 border-b border-[#D4AF37]">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Name
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Email
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Phone
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Gender
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">
                        {user.gender || "Not Selected"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Date of Birth
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">
                        {user.dob || "Not provided"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">
                        Address
                      </h3>
                      <p className="mt-1 text-lg text-[#4B3832]">
                        {user.address?.line1 || user.address?.line2
                          ? `${user.address.line1}, ${user.address.line2}`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-[#4B3832] text-white px-6 py-2 rounded-md hover:bg-[#3a2c24] transition-colors duration-300 font-medium"
                >
                  Update Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            encType="multipart/form-data"
          >
            <div className="border-t-4 border-[#D4AF37]"></div>
            <div className="p-8">
              <h2 className="text-2xl font-serif font-bold text-[#4B3832] mb-6 pb-2 border-b border-[#D4AF37]">
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address.line2"
                    value={formData.address.line2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4B3832] mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, JPEG, or PNG. Max size: 5MB
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#4B3832] text-white px-6 py-2 rounded-md hover:bg-[#3a2c24] transition-colors duration-300 font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Profile;
