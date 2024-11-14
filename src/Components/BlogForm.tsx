// src/components/BlogForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBlog = {
      id: Date.now(),
      name,
      description,
      author,
      thumbnail,
      posted_at: new Date().toISOString().split('T')[0],
      likes_count: 0,
      comments_count: 0,
    };

    try {
      const response = await fetch(
        'https://blogs-admin-dashboard-backend-test.vercel.app/blogs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBlog),
        }
      );

      if (response.ok) {
        navigate('/blogs');
      } else {
        console.error('Failed to post the new blog');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleBackClick = () => {
    navigate('/blogs');
  };
  return (
    <div className="container flex flex-col justify-center mx-auto p-4 max-w-lg h-screen bg-white">
      <button
        onClick={handleBackClick}
        className="mb-4 px-4 py-2 bg-gray-300 rounded text-black transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-400 hover:shadow-lg"
      >
        ← Back to Blogs
      </button>
      <h2 className="text-2xl font-semibold mb-4">Write a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={15}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Author
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
