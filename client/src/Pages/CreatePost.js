import { useState, useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react";


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dncaefs5d/image/upload";
const CLOUDINARY_PRESET = "userProfile_pictures";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are allowed!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Upload failed");

      setImageUrl(data.secure_url);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    const postData = { content, image: imageUrl };

    try {
      const response = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create post!");

      alert("Post created successfully!");
      setContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Post</h2>
            <p className="text-gray-600">Share your thoughts and moments with the community</p>
          </div>

          <div className="space-y-6">
            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                placeholder="Share your thoughts, ideas, or experiences..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none bg-gray-50/50 backdrop-blur-sm transition-all duration-200"
                rows={4}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center justify-center gap-3 cursor-pointer p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group">
                <ImagePlus size={24} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                <span className="text-gray-600 group-hover:text-purple-600 font-medium">
                  {imageUrl ? "Change Image" : "Add Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center gap-3 text-purple-600 bg-purple-50 p-4 rounded-2xl">
                <Loader2 className="animate-spin" size={20} />
                <span className="font-medium">Uploading image...</span>
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="w-full h-80 object-cover rounded-2xl border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-2xl flex items-center justify-center">
                  <button
                    onClick={() => {
                      setImageUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-red-600"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreatePost}
              disabled={loading || !content.trim()}
              className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 transform ${
                loading || !content.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Creating Post..." : "Create Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
