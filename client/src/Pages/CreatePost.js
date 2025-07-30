import { useState, useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import Layout from "../components/Layout";


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
    <Layout>
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-xl p-6 rounded-2xl border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Post</h2>

      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none mb-4"
        rows={4}
      ></textarea>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-green-600 font-medium hover:underline mb-4">
        <ImagePlus size={18} />
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="flex items-center text-gray-600 gap-2 text-sm mb-4">
          <Loader2 className="animate-spin" size={18} />
          Uploading...
        </div>
      )}

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-full h-64 object-cover rounded-xl border"
          />
        </div>
      )}

      <button
        onClick={handleCreatePost}
        disabled={loading}
        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition duration-200"
      >
        Create Post
      </button>
    </div>
    </Layout>
  );
};

export default CreatePost;
