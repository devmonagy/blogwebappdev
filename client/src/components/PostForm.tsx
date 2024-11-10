import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "../styles/quill-custom.css"; // Import custom Quill CSS

// Import ReactQuill dynamically to handle SSR (Server-Side Rendering) issues
let ReactQuill: any = null;
if (typeof window !== "undefined") {
  ReactQuill = require("react-quill");
}

interface PostFormProps {
  initialData: {
    title: string;
    category: string;
    content: string;
    image: File | null;
    _id?: string;
  };
  onSubmit: (formData: FormData) => void;
}

// Configure the toolbar options for Quill
const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"],
];

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit }) => {
  const [postData, setPostData] = useState(initialData);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false); // Track if Quill is loaded

  useEffect(() => {
    // Check if Quill is successfully loaded
    if (ReactQuill) {
      setIsQuillLoaded(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setPostData((prevData) => ({ ...prevData, content: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPostData((prevData) => ({ ...prevData, image: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("category", postData.category);
    formData.append("content", postData.content);
    if (postData.image) {
      formData.append("image", postData.image);
    }
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-4 px-4 sm:px-0"
    >
      <input
        type="text"
        name="title"
        placeholder="Post Title"
        onChange={handleChange}
        value={postData.title}
        required
        className="w-full px-3 py-2 border rounded text-black"
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        onChange={handleChange}
        value={postData.category}
        required
        className="w-full px-3 py-2 border rounded text-black"
      />
      {isQuillLoaded && ReactQuill ? ( // Check if Quill is loaded
        <ReactQuill
          theme="snow"
          value={postData.content}
          onChange={handleContentChange}
          modules={{ toolbar: toolbarOptions }}
          className="bg-white text-black"
        />
      ) : (
        <p>Loading editor...</p> // Fallback text while Quill is loading
      )}
      <input
        type="file"
        onChange={handleFileChange}
        className="block text-white"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {postData._id ? "Update Post" : "Submit Post"}
      </button>
    </form>
  );
};

export default PostForm;
