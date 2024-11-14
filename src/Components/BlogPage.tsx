// BlogPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Comment {
  id: number;
  comment_description: string;
  likes_count: number;
  posted_at: string;
}

interface Blog {
  id: number;
  name: string;
  author: string;
  description: string;
  posted_at: string;
  likes_count: number;
  comments_count: number;
  content: string;
  comments: Comment[];
}

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `https://blogs-admin-dashboard-backend-test-iuig.vercel.app/blogs/${id}`
        );
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, refresh]);

  const handleLikeBlog = async () => {
    if (!blog) return;
    try {
      const response = await fetch(
        `https://blogs-admin-dashboard-backend-test-iuig.vercel.app/blogs/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes_count: blog.likes_count + 1 }),
        }
      );
      if (!response.ok) throw new Error('Failed to like blog');
      setBlog({ ...blog, likes_count: blog.likes_count + 1 });
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const response = await fetch(
        `https://blogs-admin-dashboard-backend-test-iuig.vercel.app/blogs/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comments: [
              ...blog!.comments,
              {
                id: Date.now(),
                comment_description: newComment,
                likes_count: 0,
              },
            ],
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to add comment');
      setNewComment('');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!blog) return;
    const updatedComments = blog.comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, likes_count: comment.likes_count + 1 }
        : comment
    );
    try {
      const response = await fetch(
        `https://blogs-admin-dashboard-backend-test-iuig.vercel.app/blogs/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments: updatedComments }),
        }
      );
      if (!response.ok) throw new Error('Failed to like comment');
      setBlog({ ...blog, comments: updatedComments });
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };
  const handleBackClick = () => {
    navigate('/blogs');
  };
  if (loading) return <div>Loading...</div>;

  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="p-20 bg-gray-50">
      <button
        onClick={handleBackClick}
        className="mb-4 px-4 py-2 bg-gray-300 rounded text-black transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-400 hover:shadow-lg hover:cursor-pointer"
      >
        ← Back to Blogs
      </button>
      <h1 className="text-4xl font-bold mb-4">{blog.name}</h1>
      <p className="text-gray-500 mb-2">
        By {blog.author} on {blog.posted_at}
      </p>
      <p className="text-gray-700 mb-6">{blog.description}</p>
      <img
        src="https://picsum.photos/800/400"
        alt="Blog post visual"
        className="mb-6 rounded-lg"
      />
      <div className="text-xl mb-6">
        {/* Displaying random lorem text as blog content */}
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque rerum
        dignissimos aut a saepe similique, sint nesciunt ducimus praesentium
        libero voluptates commodi dolorem corrupti ea officiis architecto
        repellat esse nihil culpa unde debitis dolore! Voluptatem ipsum
        repellendus consequatur, praesentium molestias ipsa, recusandae quos
        mollitia quibusdam voluptate, eligendi ipsam voluptatibus natus quo
        ratione vel aliquid tenetur laudantium minus porro itaque ullam
        cupiditate. Excepturi inventore, accusamus placeat incidunt impedit modi
        dicta. Doloribus doloremque animi necessitatibus aut porro, pariatur
        voluptas saepe quo ut officia fugit quisquam rem culpa magnam adipisci
        veniam unde accusantium, ipsa in officiis laudantium sed! Nihil sit
        adipisci eius asperiores.
        {/* More content */}
      </div>
      <div className="flex items-center mb-4">
        <button onClick={handleLikeBlog} className="text-red-500 mr-2">
          ❤️ {blog.likes_count}
        </button>
        <span>💬 {blog.comments_count}</span>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
      {blog.comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-300 py-2">
          <p>{comment.comment_description}</p>
          <button
            onClick={() => handleLikeComment(comment.id)}
            className="text-blue-500"
          >
            👍 {comment.likes_count}
          </button>
        </div>
      ))}

      <div className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
