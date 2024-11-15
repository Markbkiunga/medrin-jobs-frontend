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

  const [likedBlogs, setLikedBlogs] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  // Load likes from localStorage
  useEffect(() => {
    const storedBlogLikes = localStorage.getItem('likedBlogs');
    const storedCommentLikes = localStorage.getItem('likedComments');

    if (storedBlogLikes) setLikedBlogs(new Set(JSON.parse(storedBlogLikes)));
    if (storedCommentLikes)
      setLikedComments(new Set(JSON.parse(storedCommentLikes)));
  }, []);

  // Persist likes to localStorage
  useEffect(() => {
    localStorage.setItem('likedBlogs', JSON.stringify(Array.from(likedBlogs)));
    localStorage.setItem(
      'likedComments',
      JSON.stringify(Array.from(likedComments))
    );
  }, [likedBlogs, likedComments]);

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
    const hasLiked = likedBlogs.has(blog.id);

    try {
      const response = await fetch(
        `https://blogs-admin-dashboard-backend-test-iuig.vercel.app/blogs/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            likes_count: blog.likes_count + (hasLiked ? -1 : 1),
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to like/dislike blog');

      setBlog({
        ...blog,
        likes_count: blog.likes_count + (hasLiked ? -1 : 1),
      });
      setLikedBlogs((prev) => {
        const updated = new Set(prev);
        if (hasLiked) updated.delete(blog.id);
        else updated.add(blog.id);
        return updated;
      });
    } catch (error) {
      console.error('Error liking/disliking blog:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!blog) return;

    const hasLiked = likedComments.has(commentId);

    const updatedComments = blog.comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, likes_count: comment.likes_count + (hasLiked ? -1 : 1) }
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
      if (!response.ok) throw new Error('Failed to like/dislike comment');

      setBlog({ ...blog, comments: updatedComments });
      setLikedComments((prev) => {
        const updated = new Set(prev);
        if (hasLiked) updated.delete(commentId);
        else updated.add(commentId);
        return updated;
      });
    } catch (error) {
      console.error('Error liking/disliking comment:', error);
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
        facere omnis nisi optio dicta eius. Assumenda maxime ab rerum delectus!
        Ipsa porro ea reprehenderit distinctio deserunt assumenda saepe
        laudantium optio, et veritatis aspernatur dolor neque deleniti iusto
        consequuntur accusantium debitis maiores blanditiis aperiam sit enim!
        Corporis molestias labore aliquam debitis omnis ullam nam? Repellendus
        placeat cum illo. Perferendis dignissimos eius cum dicta sed quibusdam
        ipsam fugit quisquam. Consequuntur excepturi, molestias consectetur
        eveniet delectus doloremque optio assumenda soluta natus magni?
        Voluptate consequatur perferendis facere architecto officiis repellat
        adipisci sed eligendi distinctio quam id dicta culpa, qui aperiam vero!
        Iure, illum minima?
      </div>
      <div className="flex items-center mb-4">
        <button onClick={handleLikeBlog} className="mr-2">
          {likedBlogs.has(blog.id) ? '❤️' : '🤍'} {blog.likes_count}
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
            {likedComments.has(comment.id) ? '👍' : '👎'} {comment.likes_count}
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
