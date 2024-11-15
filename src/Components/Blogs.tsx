/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>(() => {
    // Retrieve saved blogs from localStorage on initial load
    const saved = localStorage.getItem('savedBlogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [currentTab, setCurrentTab] = useState<
    'discover' | 'saved' | 'myblogs'
  >('discover');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const blogsPerPage = 5;

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

  // Update localStorage whenever savedBlogs changes
  useEffect(() => {
    localStorage.setItem('savedBlogs', JSON.stringify(savedBlogs));
  }, [savedBlogs]);

  // Filter blogs by search term (name or author)
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  // Save blog
  const handleSaveBlog = (blog: Blog) => {
    if (!savedBlogs.some((savedBlog) => savedBlog.id === blog.id)) {
      setSavedBlogs([...savedBlogs, blog]);
    }
  };

  // Unsave blog
  const handleUnsaveBlog = (blogId: number) => {
    setSavedBlogs(savedBlogs.filter((blog) => blog.id !== blogId));
  };

  // Navigation to individual blog details
  const handleNavigate = (blogId: number) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-20 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by blog name or author"
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => navigate('/write-blog')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          Write a Blog
        </button>
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
                onClick={() => handleNavigate(blog.id)}
                className="flex flex-col md:flex-row items-center md:items-start p-4 border rounded-lg shadow-sm bg-white transform transition-transform duration-300 cursor-pointer hover:scale-105"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-blue-500">
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
                <button className="text-gray-500 hover:text-gray-700">
                  {savedBlogs.some((savedBlog) => savedBlog.id === blog.id) ? (
                    <img
                      className="w-12"
                      src={bookmarked}
                      alt="bookmarked-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsaveBlog(blog.id);
                      }}
                    />
                  ) : (
                    <img
                      className="w-12"
                      src={bookmark}
                      alt="bookmark-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveBlog(blog);
                      }}
                    />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No blogs found.</p>
          )}

          {/* Pagination Component */}
          <div className="flex justify-center items-center text-gray-600">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`mr-2 ${
                currentPage === 1 ? 'text-gray-400' : 'text-blue-500'
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-2 ${
                currentPage === totalPages ? 'text-gray-400' : 'text-blue-500'
              }`}
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
                className="flex flex-col md:flex-row items-center md:items-start p-4 border rounded-lg shadow-sm bg-white transform transition-transform duration-300 cursor-pointer hover:scale-105"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <h2
                    className="text-lg font-semibold text-blue-500"
                    onClick={() => handleNavigate(blog.id)}
                  >
                    {blog.name} by {blog.author}
                  </h2>
                  <p className="text-gray-600">{blog.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted: {blog.posted_at}
                  </p>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <img
                    className="w-12"
                    src={bookmarked}
                    alt="bookmarked-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsaveBlog(blog.id);
                    }}
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No saved blogs yet.</p>
          )}
        </div>
      )}

      {currentTab === 'myblogs' && (
        <div className="space-y-6">
          {myBlogs.length > 0 ? (
            myBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col md:flex-row items-center md:items-start p-4 border rounded-lg shadow-sm"
              ></div>
            ))
          ) : (
            <p className="text-gray-500">No written blogs yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
