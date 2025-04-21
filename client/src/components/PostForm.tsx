import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "../styles/quill-custom.css";

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

const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit }) => {
  const [postData, setPostData] = useState(initialData);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  useEffect(() => {
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
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={postData.title}
        onChange={handleChange}
        required
        className="w-full text-4xl font-serif text-gray-700 placeholder-gray-400 focus:outline-none"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={postData.category}
        onChange={handleChange}
        required
        className="w-full text-lg font-sans text-gray-600 placeholder-gray-400 focus:outline-none"
      />

      {isQuillLoaded && ReactQuill ? (
        <div
          className="relative group rounded-lg border border-gray-300 hover:border-gray-400 transition"
          onClick={() => {
            const quill = document.querySelector(".ql-editor") as HTMLElement;
            if (quill) quill.focus();
          }}
        >
          <ReactQuill
            theme="snow"
            value={postData.content}
            onChange={handleContentChange}
            modules={{ toolbar: toolbarOptions }}
            className="custom-quill-editor text-lg text-gray-800"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading editor...</p>
      )}

      <div className="pt-6">
        <label
          htmlFor="imageUpload"
          className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:border-gray-500 transition"
        >
          {postData.image ? (
            <span>{postData.image.name}</span>
          ) : (
            <>
              <span className="block font-medium text-gray-700">
                Click to upload image
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG, JPEG up to 5MB
              </span>
            </>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {postData._id ? "Update Post" : "Publish"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
