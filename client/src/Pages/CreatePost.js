import { useState, useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react"; // Import icons
import "../styles/CreatePost.css"; // Import CSS

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dncaefs5d/image/upload";
const CLOUDINARY_PRESET = "userProfile_pictures";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type & size
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are allowed!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
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

      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new post
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
    <div className="post-form">
      {/* Post Content Input */}
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {/* Image Upload Input */}
      <label className="upload-label">
        <ImagePlus size={18} /> Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
      </label>

      {/* Uploading Indicator */}
      {loading && (
        <p className="uploading-text">
          <Loader2 size={18} className="spinner" /> Uploading...
        </p>
      )}

      {/* Image Preview */}
      {imageUrl && <img src={imageUrl} alt="Uploaded preview" className="uploaded-image" />}

      {/* Create Post Button */}
      <button onClick={handleCreatePost} className="create-post-btn" disabled={loading}>
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
