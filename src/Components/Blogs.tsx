import React, { useEffect, useState } from 'react';
import bookmark from '../assets/bookmark.svg';
import bookmarked from '../assets/bookmarked.svg';
import { useNavigate } from 'react-router-dom';

type Blog = {
  id: number;
  name: string;
  description: string;
  author: string;
  posted_at: string;
  likes_count: number;
  comments_count: number;
};

const Blogs: React.FC = () => {
  //States
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);
  const [currentTab, setCurrentTab] = useState<
    'discover' | 'saved' | 'myblogs'
  >('discover');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const blogsPerPage = 5;
  // Fetch Blogs Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://blogs-admin-dashboard-backend-test.vercel.app/blogs'
        );
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered blogs based on search term which can be name or author
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const handleSaveBlog = (blog: Blog) => {
    if (!savedBlogs.some((savedBlog) => savedBlog.id === blog.id)) {
      setSavedBlogs([...savedBlogs, blog]);
    }
  };

  const handleUnsaveBlog = (blogId: number) => {
    setSavedBlogs(savedBlogs.filter((blog) => blog.id !== blogId));
  };
  const navigate = useNavigate();
  const handleNavigate = (blogId: number) => {
    navigate(`/blogs/${blogId}`);
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by blog name or author"
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          className={`font-semibold border-b-2 ${
            currentTab === 'discover' ? 'border-blue-500' : ''
          }`}
          onClick={() => setCurrentTab('discover')}
        >
          Discover Blogs
        </button>
        <button
          className={`font-semibold border-b-2 ${
            currentTab === 'saved' ? 'border-blue-500' : ''
          }`}
          onClick={() => setCurrentTab('saved')}
        >
          Saved Blogs
        </button>
        <button
          className={`font-semibold border-b-2 ${
            currentTab === 'myblogs' ? 'border-blue-500' : ''
          }`}
          onClick={() => setCurrentTab('myblogs')}
        >
          My Blogs
        </button>
      </div>

      {/* Render Current Tab */}
      {currentTab === 'discover' && (
        <div className="space-y-6">
          {paginatedBlogs.length > 0 ? (
            paginatedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col md:flex-row items-center md:items-start p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <h2
                    className="text-lg font-semibold text-blue-500 hover:underline cursor-pointer"
                    onClick={() => {
                      handleNavigate(blog.id);
                    }}
                  >
                    {blog.name} by {blog.author}
                  </h2>
                  <p className="text-gray-600">{blog.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {blog.posted_at}
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-1">❤️</span>
                      <span>{blog.likes_count}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-1">💬</span>
                      <span>{blog.comments_count}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleSaveBlog(blog)}
                >
                  {savedBlogs.some((savedBlog) => savedBlog.id === blog.id) ? (
                    <img
                      className="w-12"
                      src={bookmarked}
                      alt="bookmarked-icon"
                    />
                  ) : (
                    <img className="w-12" src={bookmark} alt="bookmark-icon" />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No blogs found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              className="text-gray-600 hover:text-blue-600"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="text-gray-600 hover:text-blue-600"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentTab === 'saved' && (
        <div className="space-y-6">
          {savedBlogs.length > 0 ? (
            savedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col md:flex-row items-center md:items-start p-4 border rounded-lg shadow-sm"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-blue-600">
                    {blog.name} by {blog.author}
                  </h2>
                  <p className="text-gray-600">{blog.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {blog.posted_at}
                  </p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleUnsaveBlog(blog.id)}
                >
                  {savedBlogs.some((savedBlog) => savedBlog.id === blog.id) ? (
                    <img
                      className="w-12"
                      src={bookmarked}
                      alt="bookmarked-icon"
                    />
                  ) : (
                    <img className="w-12" src={bookmark} alt="bookmark-icon" />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No saved blogs yet.</p>
          )}
        </div>
      )}

      {currentTab === 'myblogs' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">My Blogs</h3>
          <p className="text-gray-500">This section is under construction.</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
