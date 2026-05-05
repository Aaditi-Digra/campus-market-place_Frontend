import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Stationery",
  "Sports",
  "Other",
];

const MyListing = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "Other",
    inStock: true,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning("You can only upload up to 5 images");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.category ||
      images.length === 0
    ) {
      toast.error("Please fill all required fields and upload at least one image");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    data.append("inStock", formData.inStock);

    images.forEach((image) => {
      data.append("image", image);
    });

    try {
      const response = await apiClient.post("/products/create", data);
      if (response.data) {
        toast.success("Product listed successfully!");
        setFormData({
          title: "",
          description: "",
          price: "",
          quantity: "",
          category: "Other",
          inStock: true,
        });
        setImages([]);
        setPreviews([]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Failed to list product");
    } finally {
      setLoading(false);
    }
  };

  // Using MUI CSS Variables for 100% theme synchronization
  const themedStyle = {
    color: "var(--mui-palette-text-primary)",
    backgroundColor: "var(--mui-palette-background-paper)",
    borderColor: "var(--mui-palette-divider)",
  };

  const inputStyle = {
    backgroundColor: "var(--mui-palette-background-default)",
    color: "var(--mui-palette-text-primary)",
    borderColor: "var(--mui-palette-divider)",
  };

  const secondaryTextStyle = {
    color: "var(--mui-palette-text-secondary)",
  };

  return (
    <div className="w-full flex justify-center items-start p-4 md:p-8 transition-colors duration-300">
      <div 
        className="w-full max-w-5xl rounded-2xl p-6 md:p-10 border shadow-2xl transition-all duration-300 my-4"
        style={themedStyle}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase" style={{ color: themedStyle.color }}>
            LIST YOUR PRODUCT
          </h1>
          <p className="text-lg" style={secondaryTextStyle}>
            Fill in the details below to showcase your item on the campus marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                Product Title <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Engineering Physics Vol 1"
                  className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                Description <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="1"
                  placeholder="Tell us more about the item..."
                  className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-medium"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                Price <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-blue-500">₹</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>
                Available Quantity <span className="text-blue-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </span>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-10" style={{ borderColor: themedStyle.borderColor }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Category Selection</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border rounded-xl py-4 pl-12 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none font-medium cursor-pointer"
                      style={inputStyle}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} style={{ backgroundColor: themedStyle.backgroundColor, color: themedStyle.color }}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Media Upload</label>
                  <label 
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl hover:bg-blue-500/5 transition-all cursor-pointer group"
                    style={{ backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor }}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-bold" style={{ color: themedStyle.color }}>Browse Images</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold uppercase tracking-widest opacity-80" style={{ color: themedStyle.color }}>Previews ({previews.length}/5)</label>
                <div 
                  className="h-[224px] border rounded-2xl p-4 overflow-y-auto custom-scrollbar"
                  style={{ backgroundColor: "var(--mui-palette-background-default)", borderColor: themedStyle.borderColor }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border group" style={{ borderColor: themedStyle.borderColor }}>
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <label className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer" style={{ borderColor: themedStyle.borderColor }}>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
            <div 
              className="flex items-center justify-between p-5 border rounded-2xl shadow-inner"
              style={{ backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor }}
            >
              <span className="font-black tracking-tight text-lg uppercase" style={{ color: themedStyle.color }}>STOCK STATUS</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div 
                  className="w-14 h-8 bg-gray-300 dark:bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:border-none after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-xl"
                ></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer h-full min-h-[72px] font-black text-xl rounded-2xl uppercase tracking-[3px] shadow-2xl active:scale-[0.97] transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              style={{ 
                backgroundColor: "var(--mui-palette-primary-main)", 
                color: "var(--mui-palette-primary-contrastText)" 
              }}
            >
              <span>{loading ? "LISTING..." : "LIST NOW"}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--mui-palette-divider);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MyListing;
